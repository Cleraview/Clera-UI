import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest/presets/default-esm',

  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',

  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '\\.svg$': '<rootDir>/__mocks__/svg.ts',
    '^@root/(.*)$': '<rootDir>/$1',
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
      ')/)',
  ],

  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true,
      tsconfig: 'tsconfig.json'
    }]
  },
}

export default config