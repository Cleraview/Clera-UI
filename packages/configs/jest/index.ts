import type { Config } from 'jest'

/**
 * Base Jest configuration shared across Clera workspace packages.
 *
 * Consumers should spread this into their own `jest.config.ts` and
 * override or extend fields as needed (e.g. add package-specific
 * `moduleNameMapper` entries for SVG mocks).
 */
export const baseConfig: Config = {
  preset: 'ts-jest/presets/default-esm',
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(' +
      'gsap' +
      '|@radix-ui/.*' +
      '|@hookform/.*' +
      '|@tanstack/.*' +
      '|cmdk' +
      '|react-icons' +
      '|date-fns' +
      '|zod' +
      '|@clera/.*' +
      ')/)',
  ],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.json',
      },
    ],
  },
}

export default baseConfig
