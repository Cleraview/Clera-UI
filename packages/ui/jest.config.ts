import type { Config } from 'jest'
import { baseConfig } from '@clera/config-jest'

const config: Config = {
  ...baseConfig,
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy',
    '\\.svg$': '<rootDir>/__mocks__/svg.ts',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

export default config
