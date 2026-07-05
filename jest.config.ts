import type { Config } from 'jest'

const config: Config = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: 'coverage',

    moduleNameMapper: {
      '^(\\.{1,2}/.*)\\.ts$': '$1',
    },

    testEnvironment: 'node',

    setupFiles: ['dotenv/config'],

    transform: {
      '^.+\\.tsx?$': [
        'ts-jest',
        {
          tsconfig: 'tsconfig.test.json',
          useESM: true,
        },
      ],
    },
}

export default config
