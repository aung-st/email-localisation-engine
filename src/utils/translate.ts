import { LibreTranslateFactory } from '../services/libreTranslateFactory'
import type { TranslationResponse } from '../services/types'
import { extractPlaceholders, restorePlaceholders } from './placeholders'

const baseUrl = import.meta.env.VITE_BASE_URL
const factory = new LibreTranslateFactory()

/**
 * Translates text from source language to target language
 * Extracts placeholders, translates the text, and restores placeholders
 * @param text - Original text to translate
 * @param sourceLanguage - Source language code (ISO 639-1)
 * @param targetLanguage - Target language code (ISO 639-1)
 * @returns Promise resolving to TranslationResponse with translated text
 */
export async function translate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
): Promise<TranslationResponse> {
    const { scrubbed, map } = extractPlaceholders(text)

    const engine = factory.buildEngine({ engine: 'LibreTranslate', baseUrl })
    const result = await engine.translateText({
        text: scrubbed,
        sourceLanguage,
        targetLanguage,
    })

    return {
        translatedText: restorePlaceholders(result.translatedText, map),
    }
}
