import js from '@eslint/js'
import globals from 'globals'

const baseLanguageOptions = {
  ecmaVersion: 2022,
  sourceType: 'module',
  globals: {
    ...globals.node
  }
}

export default [
  {
    ...js.configs.recommended,
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      ...baseLanguageOptions,
      globals: {
        ...(js.configs.recommended.languageOptions?.globals ?? {}),
        ...baseLanguageOptions.globals
      }
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error'
    }
  },
  {
    files: ['test/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly'
      }
    }
  }
]
