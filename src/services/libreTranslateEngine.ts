import type { LocalisationEngineConfig } from './types.ts'
import type { TranslationRequest, TranslationResponse } from './types.ts'
import type { LocalisationEngine } from './localisationEngine.ts'
import { post } from '../utils/apiClient.ts'

interface LibreTranslateRequestBody {
  q: string
  source: string
  target: string
  format: string
}

interface LibreTranslateResponseBody {
  translatedText: string
}

export class LibreTranslateEngine implements LocalisationEngine {
  private readonly baseUrl: string
  private readonly apiKey?: string

  constructor(config: LocalisationEngineConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '')
    this.apiKey = config.apiKey
  }

  async translateText(
    request: TranslationRequest,
  ): Promise<TranslationResponse> {
    const body: LibreTranslateRequestBody = {
      q: request.text,
      source: request.sourceLanguage,
      target: request.targetLanguage,
      format: 'text',
    }

    const { data } = await post<LibreTranslateRequestBody, LibreTranslateResponseBody>(
      `${this.baseUrl}/translate`,
      body,
      this.apiKey,
    )

    return { translatedText: data.translatedText }
  }
}
