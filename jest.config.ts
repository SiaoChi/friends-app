import type { JestConfigWithTsJest } from 'ts-jest'
const jestConfig: JestConfigWithTsJest = {
  preset: 'ts-jest/presets/default-esm',
  // extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ]
}

export default jestConfig

