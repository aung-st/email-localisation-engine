import { describe, it, expect } from '@jest/globals'
import { LibreTranslateFactory } from '../../services/libreTranslateFactory'
import { LibreTranslateEngine } from '../../services/libreTranslateEngine'
import type { LocalisationEngine } from '../../services/localisationEngine'

const baseUrl = process.env.VITE_BASE_URL as string

describe('LibreTranslateFactory', () => {
    it('creates a LibreTranslateEngine via buildEngine', () => {
        const factory = new LibreTranslateFactory()
        const engine = factory.buildEngine({
            engine: 'LibreTranslate',
            baseUrl,
        })

        expect(engine).toBeInstanceOf(LibreTranslateEngine)
        expect((engine as LocalisationEngine).translateText).toBeDefined()
    })
})
