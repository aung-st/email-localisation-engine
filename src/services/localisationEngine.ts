import type { TranslationRequest, TranslationResponse } from './types'

export interface LocalisationEngine {
    translateText(request: TranslationRequest): Promise<TranslationResponse>
}
