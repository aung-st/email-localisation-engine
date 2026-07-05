import { LibreTranslateFactory } from '../services/libreTranslateFactory'
import type { TranslationResponse } from '../services/types'

const baseUrl = import.meta.env.VITE_BASE_URL
const factory = new LibreTranslateFactory()

export async function translate(
  text: string,
  sourceLanguage: string,
  targetLanguage: string,
): Promise<TranslationResponse> {
  const engine = factory.buildEngine({ engine: 'LibreTranslate', baseUrl })
  return engine.translateText({ text, sourceLanguage, targetLanguage })
}
