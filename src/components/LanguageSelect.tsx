/**
 * Props interface for the LanguageSelect component
 * @property sourceLanguage - Current source language code (ISO 639-1)
 * @property targetLanguage - Current target language code (ISO 639-1)
 * @property onSourceChange - Callback triggered when source language changes
 * @property onTargetChange - Callback triggered when target language changes
 * @property loading - Whether translation is currently in progress
 * @property hasText - Whether text has been provided for translation
 */
interface LanguageSelectProps {
    /** Current target language code (ISO 639-1) */
    targetLanguage: string
    /** Callback triggered when target language changes */
    onTargetChange: (language: string) => void
    /** Whether translation is currently in progress */
    loading: boolean
    /** Whether text has been provided for translation */
    hasText: boolean
}

/**
 * Available languages for translation
 * Maps ISO 639-1 language codes to display labels
 */
const languages = [
    { code: 'es', label: 'Spanish' },
    { code: 'fr', label: 'French' },
]

/**
 * React component for selecting source and target languages
 * Allows users to choose languages for text translation
 */
export function LanguageSelect({
    targetLanguage,
    onTargetChange,
    loading,
    hasText,
}: LanguageSelectProps) {
    return (
        <fieldset>
            <legend>Language</legend>
            <div className="language-row">
                    <select
                        value={targetLanguage}
                        onChange={(e) => onTargetChange(e.target.value)}
                    >
                        {languages.map((language) => (
                            <option key={language.code} value={language.code}>
                                {language.label}
                            </option>
                        ))}
                    </select>
                <button type="submit" disabled={loading || !hasText}>
                    {loading ? 'Translating...' : 'Translate'}
                </button>
            </div>
        </fieldset>
    )
}
