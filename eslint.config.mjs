import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import vueParser from 'vue-eslint-parser'

const tsLanguageOptions = {
  parser: tsParser,
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
    ignores: ['.build/**', 'dist/**', 'coverage/**', 'node_modules/**'],
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
]
