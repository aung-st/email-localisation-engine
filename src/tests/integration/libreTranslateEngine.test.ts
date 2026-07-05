import { describe, it, expect } from '@jest/globals'
import { LibreTranslateFactory } from '../../services/libreTranslateFactory'

const baseUrl = process.env.BASE_URL as string

describe('LibreTranslateEngine (integration)', () => {
    it('translates "hello" from English to Spanish', async () => {
        const factory = new LibreTranslateFactory()
        const engine = factory.buildEngine({
            engine: 'LibreTranslate',
            baseUrl,
        })

        const result = await engine.translateText({
            text: 'hello',
            sourceLanguage: 'en',
            targetLanguage: 'es',
        })

        expect(result.translatedText).toBe('hola')
    })
})
