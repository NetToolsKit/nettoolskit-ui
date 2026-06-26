import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import vueParser from 'vue-eslint-parser'
import globals from 'globals'

const runtimeGlobals = {
  ...globals.browser,
  ...globals.node,
  ...globals.es2026,
}

const tsLanguageOptions = {
  parser: tsParser,
  globals: runtimeGlobals,
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
}

const tsRules = {
  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': [
    'warn',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    },
  ],
  'no-console': ['warn', { allow: ['warn', 'error'] }],
}

export default [
  {
    ignores: ['.build/**', '.temp/**', 'dist/**', 'node_modules/**'],
  },

  js.configs.recommended,

  // Vue (flat config)
  ...(vue.configs['flat/recommended'] ?? []),

  // TS files
  {
    files: ['**/*.ts'],
    languageOptions: tsLanguageOptions,
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: tsRules,
  },

  // Vue SFCs
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      globals: runtimeGlobals,
      parserOptions: {
        ...tsLanguageOptions.parserOptions,
        parser: tsParser,
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      ...tsRules,
      'vue/require-default-prop': 'off',
    },
  },

  // --- Legacy reintroduction guard ---
  // The legacy Ntk*/Base* surface and the `src/components` tree were removed
  // (see docs/MIGRATION.md). Block any re-introduction across app, samples and tests.
  // The stricter design-system/core blocks below override this for their files.
  {
    files: ['src/**/*.ts', 'src/**/*.vue', 'samples/**/*.{ts,vue}', 'tests/**/*.{ts,vue}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '**/components/form/*',
                '**/components/layout/*',
                '**/components/ui/*',
                '**/components/builders/*',
              ],
              message:
                'The legacy src/components surface was removed. Use the Ds* design system instead (see docs/MIGRATION.md).',
            },
            {
              group: ['**/Ntk*', '**/Base*'],
              message:
                'Legacy Ntk*/Base* components were removed. Use the Ds* equivalents (see docs/MIGRATION.md).',
            },
          ],
        },
      ],
    },
  },

  // --- Platform governance: executable import boundaries (engineering-first) ---
  // The Ds* design system must never depend on the legacy Ntk*/Base* surface.
  // This locks the governed surface and prevents new legacy coupling while the
  // legacy-surface-elimination workstream removes the old components.
  {
    files: ['src/design-system/**/*.ts', 'src/design-system/**/*.vue'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/Ntk*', '**/Base*'],
              message:
                'The Ds* design system must not import legacy Ntk*/Base* components. Use Ds* primitives/recipes instead.',
            },
          ],
        },
      ],
    },
  },

  // The pure core layer must stay framework-agnostic (Clean Architecture):
  // no Vue, Quasar, router, or legacy component coupling.
  {
    files: ['src/design-system/core/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'vue', message: 'core must stay framework-agnostic: no Vue in the pure core layer.' },
            { name: 'vue-router', message: 'core must stay framework-agnostic: no vue-router in the pure core layer.' },
            { name: 'quasar', message: 'core must not import Quasar; keep it behind adapters.' },
          ],
          patterns: [
            {
              group: ['@vue/*', '@quasar/*', '**/Ntk*', '**/Base*'],
              message: 'core must stay framework-agnostic and free of legacy components.',
            },
          ],
        },
      ],
    },
  },
]