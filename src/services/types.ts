export interface TranslationRequest {
  text: string
  sourceLanguage: string
  targetLanguage: string
}

export interface TranslationResponse {
  translatedText: string
}

export type EngineType = "LibreTranslate" | "DeepL"

export interface LocalisationEngineConfig {
  baseUrl: string
  apiKey?: string
  engine: EngineType
}

