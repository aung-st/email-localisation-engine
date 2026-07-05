import type { LocalisationEngine } from './localisationEngine'
import type { LocalisationEngineConfig } from './types'

export abstract class LocalisationFactory {
    protected abstract createEngine(
        config: LocalisationEngineConfig
    ): LocalisationEngine

    buildEngine(config: LocalisationEngineConfig): LocalisationEngine {
        return this.createEngine(config)
    }
}
