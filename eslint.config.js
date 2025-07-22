export default {
  env: {
    node: true,
    es2022: true
  },
  extends: ['eslint:recommended'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  },
  overrides: [
    {
      files: ['test/**/*.js'],
      env: {
        node: true
      },
      globals: {
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly'
      }
    }
  ]
} 