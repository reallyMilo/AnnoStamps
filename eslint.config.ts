import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
import eslint from '@eslint/js';
import vitest from '@vitest/eslint-plugin';
import eslintNext from 'eslint-config-next/typescript';
import pluginCypress from 'eslint-plugin-cypress';
import jsonc from 'eslint-plugin-jsonc';
import n from 'eslint-plugin-n';
import packageJson from 'eslint-plugin-package-json';
import perfectionist from 'eslint-plugin-perfectionist';
import reactCompiler from 'eslint-plugin-react-compiler';
import reactHooks from 'eslint-plugin-react-hooks';
import testingLibrary from 'eslint-plugin-testing-library';
import yml from 'eslint-plugin-yml';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig(
	globalIgnores([
		'.next/**',
		'out/**',
		'build/**',
		'**/*.d.ts',
		'node_modules',
		'pnpm-lock.yaml',
		'terraform',
		'volume',
		'docker-compose.yaml',
		'.env.*',
		'prisma/migrations/*',
		'generated/*',
		'src/components/ui/**',
	]),
	{ linterOptions: { reportUnusedDisableDirectives: 'error' } },

	{
		extends: [
			comments.recommended,
			eslint.configs.recommended,
			n.configs['flat/recommended'],
			perfectionist.configs['recommended-natural'],
			tseslint.configs.strictTypeChecked,
			tseslint.configs.stylisticTypeChecked,
			reactHooks.configs.flat.recommended,
			reactCompiler.configs.recommended,
			eslintNext,
		],
		files: ['**/*.{js,ts,tsx}'],
		languageOptions: {
			parserOptions: {
				projectService: {
					allowDefaultProject: ['vitest.config.mts', 'cypress.config.ts'],
				},
			},
		},
		rules: {
			// These on-by-default rules work well for this repo if configured
			'@typescript-eslint/no-misused-promises': [
				'error',
				{ checksVoidReturn: false },
			],
			'@typescript-eslint/prefer-nullish-coalescing': [
				'error',
				{ ignorePrimitives: true },
			],
			'@typescript-eslint/restrict-template-expressions': [
				'error',
				{ allowBoolean: true, allowNullish: true, allowNumber: true },
			],

			'n/no-unsupported-features/node-builtins': [
				'error',
				{ allowExperimental: true, ignores: ['import.meta.dirname'] },
			],
			// Stylistic concerns that don't interfere with Prettier
			'logical-assignment-operators': [
				'error',
				'always',
				{ enforceForIfStatements: true },
			],
			'no-useless-rename': 'error',
			'object-shorthand': 'error',
			'operator-assignment': 'error',

			// https://github.com/eslint-community/eslint-plugin-n/issues/472
			'n/no-unpublished-bin': 'off',

			'no-console': ['error', { allow: ['warn', 'time', 'error', 'timeEnd'] }],
		},
		settings: { perfectionist: { partitionByComment: true, type: 'natural' } },
	},
	{
		files: ['**/*.{ts,tsx,mts,cts}'],
		rules: {
			'n/no-missing-import': 'off',
		},
	},
	{
		extends: [vitest.configs.recommended, testingLibrary.configs['flat/react']],
		files: ['**/*.test.*'],
		rules: { '@typescript-eslint/no-unsafe-assignment': 'off' },
		settings: { vitest: { typecheck: true } },
	},
	{
		extends: [pluginCypress.configs.recommended, pluginCypress.configs.globals],
		files: ['**/*.cy.*'],
	},
	{
		extends: [yml.configs['flat/standard'], yml.configs['flat/prettier']],
		files: ['**/*.{yml,yaml}'],
		ignores: ['**/dependabot.yaml'],
		rules: {
			'yml/file-extension': ['error', { extension: 'yaml' }],
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
	{
		extends: [jsonc.configs['flat/recommended-with-json']],
		files: ['**/*.json'],
		ignores: ['.vscode/*'],
	},
	{
		extends: [packageJson.configs.recommended, packageJson.configs.stylistic],
		files: ['package.json'],
	},
);
