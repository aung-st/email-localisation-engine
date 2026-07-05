/**
 * Interface for translation request parameters
 * @property text - The text content to be translated
 * @property sourceLanguage - ISO 639-1 language code for source language
 * @property targetLanguage - ISO 639-1 language code for target language
 */
export interface TranslationRequest {
    /** The text content to be translated */
    text: string
    /** ISO 639-1 language code for source language */
    sourceLanguage: string
    /** ISO 639-1 language code for target language */
    targetLanguage: string
}

/**
 * Interface for translation response data
 * @property translatedText - The translated text content
 */
export interface TranslationResponse {
    /** The translated text content */
    translatedText: string
}

/**
 * Type representing supported translation engines
 * Only 'LibreTranslate' and 'DeepL' are currently supported
 */
export type EngineType = 'LibreTranslate' | 'DeepL'

/**
 * Interface for localization engine configuration
 * @property baseUrl - Base URL for the translation API
 * @property apiKey - Optional API key for authentication
 * @property engine - Type of translation engine to use
 */
export interface LocalisationEngineConfig {
    /** Base URL for the translation API */
    baseUrl: string
    /** Optional API key for authentication */
    apiKey?: string
    /** Type of translation engine to use */
    engine: EngineType
}
