import type {
  TranslationRequest,
  TranslationResponse,
  EmailContent,
  LocalisedEmail,
} from './types.ts'

export interface LocalisationEngine {
  translateText(request: TranslationRequest): Promise<TranslationResponse>
  translateEmail(
    email: EmailContent,
    sourceLang: string,
    targetLang: string,
  ): Promise<LocalisedEmail>
}
