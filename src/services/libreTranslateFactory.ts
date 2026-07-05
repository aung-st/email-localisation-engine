import { LocalisationFactory } from './localisationFactory'
import type { LocalisationEngineConfig } from './types'
import type { LocalisationEngine } from './localisationEngine'
import { LibreTranslateEngine } from './libreTranslateEngine'

/**
 * Factory class for creating LibreTranslate engine instances
 * Extends the abstract LocalisationFactory to provide concrete implementations
 */
export class LibreTranslateFactory extends LocalisationFactory {
    /**
     * Creates a new LibreTranslate engine instance with the given configuration
     * @param config - Engine configuration (baseUrl, apiKey, engine type)
     * @returns A new LibreTranslateEngine instance
     */
    protected createEngine(
        config: LocalisationEngineConfig
    ): LocalisationEngine {
        return new LibreTranslateEngine(config)
    }
}
