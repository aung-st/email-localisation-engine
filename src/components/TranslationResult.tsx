/**
 * Props interface for the TranslationResult component
 * Displays translation results and any error messages
 * @param result - Translation result containing translated text
 * @param error - Error message to display if translation fails
 */
import type { TranslationResponse } from '../services/types'
import { EmailPreview } from './EmailPreview'

interface TranslationResultProps {
    /** Translation result containing translated text */
    result: TranslationResponse | null
    /** Error message to display if translation fails */
    error: string
}

/**
 * React component for displaying translation results
 * Shows error messages (if any) and the EmailPreview component with translated text
 */
export function TranslationResult({ result, error }: TranslationResultProps) {
    return (
        <section>
            {error && <p role="alert">{error}</p>}
            <EmailPreview translatedText={result?.translatedText ?? ''} />
        </section>
    )
}
