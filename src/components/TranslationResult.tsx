import type { TranslationResponse } from '../services/types'
import { EmailPreview } from './EmailPreview'

interface TranslationResultProps {
    result: TranslationResponse | null
    error: string
}

export function TranslationResult({ result, error }: TranslationResultProps) {
    return error ? (
        <section>
            <p role="alert">{error}</p>
        </section>
    ) : result ? (
        <section>
            <EmailPreview translatedText={result.translatedText} />
        </section>
    ) : null
}
