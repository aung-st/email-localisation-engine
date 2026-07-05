import { LocalisationFactory } from './localisationFactory'
import type { LocalisationEngineConfig } from './types'
import type { LocalisationEngine } from './localisationEngine'
import { LibreTranslateEngine } from './libreTranslateEngine'

export class LibreTranslateFactory extends LocalisationFactory {
    protected createEngine(
        config: LocalisationEngineConfig
    ): LocalisationEngine {
        return new LibreTranslateEngine(config)
    }
}
