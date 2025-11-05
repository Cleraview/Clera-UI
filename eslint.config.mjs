import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import storybook from 'eslint-plugin-storybook'
import prettier from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react': react,
      'react-hooks': reactHooks,
      'prettier': prettier,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/immutability': 'off'
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.stories.{ts,tsx,mdx}'],
    plugins: {
      storybook: storybook,
    },
    rules: {
      ...storybook.configs.recommended.rules,
    },
  },
  ...compat.config({
    overrides: [
      {
        files: ['**/__tests__/**/*', '**/*.test.{ts,tsx}'],
        extends: ['plugin:testing-library/react'],
        rules: {
          'testing-library/no-unnecessary-act': 'off',
          'testing-library/no-node-access': 'off',
          'testing-library/render-result-naming-convention': 'off',
          'testing-library/no-container': 'off'
        }
      },
    ],
  }),
  // 4. Global ignores
  {
    ignores: [
      'node_modules/',
      '.next/',
      '.vercel/',
      'storybook-static/',
      'dist/',
    ],
  },
]

export default eslintConfig