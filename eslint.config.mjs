import eslint from '@eslint/js'
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs'
import eslintNextPlugin from '@next/eslint-plugin-next'
import vitest from '@vitest/eslint-plugin'
import { defineConfig } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import pluginCypress from 'eslint-plugin-cypress'
import n from 'eslint-plugin-n'
import packageJson from 'eslint-plugin-package-json'
import perfectionist from 'eslint-plugin-perfectionist'
import testingLibrary from 'eslint-plugin-testing-library'
import yml from 'eslint-plugin-yml'
import tseslint from 'typescript-eslint'

export default defineConfig(
  {
    ignores: [
      '.next/**',
      'out/**',
      'build/**',
      '**/*.d.ts',
      'node_modules',
      'pnpm-lock.yaml',
      'terraform',
      'volume',
      'docker-compose.yml',
      '.env.*',
      'prisma/migrations/*',
    ],
  },
  { linterOptions: { reportUnusedDisableDirectives: 'error' } },
  {
    extends: [eslint.configs.recommended],
    languageOptions: {
      globals: {
        React: true,
      },
    },
    rules: {
      'no-console': ['error', { allow: ['warn', 'time', 'error', 'timeEnd'] }],
      'no-unused-vars': 'off',
    },
  },
  nextVitals,
  comments.recommended,
  n.configs['flat/recommended'],
  {
    extends: [packageJson.configs.recommended],
    rules: {
      'package-json/valid-devDependencies': 'off',
    },
  },
  perfectionist.configs['recommended-natural'],
  testingLibrary.configs['flat/react'],
  {
    files: ['**/*.cy.{js,ts,jsx,tsx}'],
    rules: {
      'testing-library/await-async-queries': 'off',
      'testing-library/prefer-screen-queries': 'off',
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      next: eslintNextPlugin,
    },
    rules: {
      '@next/next/no-img-element': 'off',
      'react/function-component-definition': [
        1,
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],
    },
  },
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      extends: [
        tseslint.configs.strictTypeChecked,
        tseslint.configs.stylisticTypeChecked,
      ],
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          projectService: {
            allowDefaultProject: ['*.config.*s', 'bin/index.js'],
          },
        },
      },

      rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': [
          'error',
          { ignorePrimitives: true },
        ],
        '@typescript-eslint/restrict-template-expressions': [
          'error',
          { allowBoolean: true, allowNullish: true, allowNumber: true },
        ],
        'logical-assignment-operators': [
          'error',
          'always',
          { enforceForIfStatements: true },
        ],
        'n/no-unsupported-features/node-builtins': [
          'error',
          { allowExperimental: true, ignores: ['import.meta.dirname'] },
        ],
        'no-useless-rename': 'error',
        'object-shorthand': 'error',
        'operator-assignment': 'error',
      },
      settings: {
        perfectionist: { partitionByComment: true, type: 'natural' },
        vitest: { typecheck: true },
      },
    },
  },
  {
    extends: [tseslint.configs.disableTypeChecked],
    files: ['**/*.t*'],
    rules: { 'n/no-missing-import': 'off' },
  },
  {
    extends: [vitest.configs.recommended],
    files: ['**/*.test.*'],
    ignores: ['cypress/**'],
    languageOptions: {
      globals: {
        ...vitest.environments.env.globals,
      },
    },
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
    },
  },
  {
    extends: [pluginCypress.configs.recommended, pluginCypress.configs.globals],
    files: ['cypress/**'],
    rules: {
      'cypress/no-unnecessary-waiting': 'off',
    },
  },

  {
    extends: [yml.configs['flat/standard'], yml.configs['flat/prettier']],
    files: ['**/*.{yml,yaml}'],
    ignores: ['**/dependabot.yml'],
    rules: {
      'yml/file-extension': ['error', { extension: 'yml' }],
      'yml/sort-keys': [
        'error',
        { order: { type: 'asc' }, pathPattern: '^.*$' },
      ],
      'yml/sort-sequence-values': [
        'error',
        { order: { type: 'asc' }, pathPattern: '^.*$' },
      ],
    },
  },
)
