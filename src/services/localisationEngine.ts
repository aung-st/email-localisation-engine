import type { TranslationRequest, TranslationResponse } from './types.ts'

export interface LocalisationEngine {
  translateText(request: TranslationRequest): Promise<TranslationResponse>
}
