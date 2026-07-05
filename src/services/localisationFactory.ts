import type { LocalisationEngine } from './localisationEngine.ts'
import type { LocalisationEngineConfig } from './types.ts'

export abstract class LocalisationFactory {
  protected abstract createEngine(config: LocalisationEngineConfig): LocalisationEngine

  buildEngine(config: LocalisationEngineConfig): LocalisationEngine {
    return this.createEngine(config)
  }
}
