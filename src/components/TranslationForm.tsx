import { useState } from 'react'
import type { TranslationResponse } from '../services/types'
import { translate } from '../utils/translate'
import { TextInput } from './TextInput'
import { LanguageSelect } from './LanguageSelect'
import { TranslationResult } from './TranslationResult'

export function TranslationForm() {
    const [text, setText] = useState('')
    const [sourceLanguage, setSourceLanguage] = useState('en')
    const [targetLanguage, setTargetLanguage] = useState('es')
    const [result, setResult] = useState<TranslationResponse | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleTranslate(e: React.SyntheticEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')
        setResult(null)

        try {
            const response = await translate(
                text,
                sourceLanguage,
                targetLanguage
            )
            setResult(response)
        } catch (e) {
            setError(String(e))
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <form onSubmit={handleTranslate}>
                <h1>Email Localisation Tool</h1>

                <div className="source-preview-row">
                    <div className="source-column">
                        <TextInput
                            text={text}
                            onTextChange={setText}
                            onFileError={setError}
                        />

                        <LanguageSelect
                            sourceLanguage={sourceLanguage}
                            targetLanguage={targetLanguage}
                            onSourceChange={setSourceLanguage}
                            onTargetChange={setTargetLanguage}
                            loading={loading}
                            hasText={text.length > 0}
                        />
                    </div>

                    <TranslationResult result={result} error={error} />
                </div>
            </form>
        </>
    )
}
