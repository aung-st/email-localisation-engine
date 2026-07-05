import { LibreTranslateFactory } from '../services/libreTranslateFactory'
import type { TranslationResponse } from '../services/types'
import { translateWithPreservation } from './placeholders'

const baseUrl = import.meta.env.VITE_BASE_URL
const factory = new LibreTranslateFactory()

/**
 * Translates text from source to target language while preserving variables and URLs.
 * @param text - Original text to translate
 * @param sourceLanguage - Source language code (ISO 639-1)
 * @param targetLanguage - Target language code (ISO 639-1)
 * @returns The translation response object
 */
export async function translate(
    text: string,
    sourceLanguage: string,
    targetLanguage: string
): Promise<TranslationResponse> {
    const engine = factory.buildEngine({ engine: 'LibreTranslate', baseUrl })

    const translatedText = await translateWithPreservation(text, async (chunks: string[]) => {
        // Translate text chunks concurrently
        const translationPromises = chunks.map((chunk) =>
            engine.translateText({
                text: chunk,
                sourceLanguage,
                targetLanguage,
            })
        )

        const responses = await Promise.all(translationPromises)
        return responses.map((res) => res.translatedText)
    })

    return {
        translatedText,
    }
}