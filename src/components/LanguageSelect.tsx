interface LanguageSelectProps {
  sourceLanguage: string
  targetLanguage: string
  onSourceChange: (language: string) => void
  onTargetChange: (language: string) => void
  loading: boolean
  hasText: boolean
}

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
]

export function LanguageSelect({
  sourceLanguage,
  targetLanguage,
  onSourceChange,
  onTargetChange,
  loading,
  hasText,
}: LanguageSelectProps) {
  return (
    <fieldset>
      <legend>Language</legend>
      <label>
        From
        <select
          value={sourceLanguage}
          onChange={(e) => onSourceChange(e.target.value)}
        >
          {languages.map((language) => (
            <option key={language.code} value={language.code}>
              {language.label}
            </option>
          ))}
        </select>
      </label>
      →
      <label>
        To
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
      </label>
      <button type="submit" disabled={loading || !hasText}>
        {loading ? 'Translating...' : 'Translate'}
      </button>
    </fieldset>
  )
}
