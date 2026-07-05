import type { LocalisationEngineConfig } from './types'
import type { TranslationRequest, TranslationResponse } from './types'
import type { LocalisationEngine } from './localisationEngine'
import { post } from '../utils/apiClient'

/**
 * Interface for LibreTranslate API request body
 * @property q - The text to translate
 * @property source - Source language code
 * @property target - Target language code
 * @property format - Format of translation (always 'text' for this engine)
 */
interface LibreTranslateRequestBody {
    /** The text to translate */
    q: string
    /** Source language code */
    source: string
    /** Target language code */
    target: string
    /** Format of translation (always 'text' for this engine) */
    format: string
}

/**
 * Interface for LibreTranslate API response body
 * @property translatedText - The translated text
 */
interface LibreTranslateResponseBody {
    /** The translated text */
    translatedText: string
}

/**
 * Implementation of LocalisationEngine for LibreTranslate API
 * Translates text using the LibreTranslate machine translation service
 */
export class LibreTranslateEngine implements LocalisationEngine {
    /** Base URL for the LibreTranslate API */
    private readonly baseUrl: string
    /** Optional API key for authentication */
    private readonly apiKey?: string

    /**
     * Creates a new LibreTranslateEngine instance
     * @param config - Configuration containing baseUrl, apiKey, and engine type
     */
    constructor(config: LocalisationEngineConfig) {
        this.baseUrl = config.baseUrl.replace(/\/$/, '')
        this.apiKey = config.apiKey
    }

    /**
     * Translates text using the LibreTranslate API
     * @param request - Translation request containing text and language codes
     * @returns Promise resolving to TranslationResponse with the translated text
     */
    async translateText(
        request: TranslationRequest
    ): Promise<TranslationResponse> {
        const body: LibreTranslateRequestBody = {
            q: request.text,
            source: request.sourceLanguage,
            target: request.targetLanguage,
            format: 'text',
        }

        const { data } = await post<
            LibreTranslateRequestBody,
            LibreTranslateResponseBody
        >(`${this.baseUrl}/translate`, body, this.apiKey)

        return { translatedText: data.translatedText }
    }
}
