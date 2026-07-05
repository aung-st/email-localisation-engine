import { LocalisationFactory } from './localisationFactory.ts'
import type { LocalisationEngineConfig } from './types.ts'
import type { LocalisationEngine } from './localisationEngine.ts'
import { LibreTranslateEngine } from './libreTranslateEngine.ts'

export class LibreTranslateFactory extends LocalisationFactory {
  protected createEngine(config: LocalisationEngineConfig): LocalisationEngine {
    return new LibreTranslateEngine(config)
  }
}
