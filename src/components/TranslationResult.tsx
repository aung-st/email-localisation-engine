import type { TranslationResponse } from '../services/types'
import { EmailPreview } from './EmailPreview'

interface TranslationResultProps {
    result: TranslationResponse | null
    error: string
}

export function TranslationResult({ result, error }: TranslationResultProps) {
    return (
        <section>
            {error && <p role="alert">{error}</p>}
            <EmailPreview translatedText={result?.translatedText ?? ''} />
        </section>
    )
}
