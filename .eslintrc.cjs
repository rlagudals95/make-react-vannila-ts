module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: 'standard-with-typescript',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json'
  },
  rules: {
    '@typescript-eslint/no-non-null-assertion': 0,
    '@typescript-eslint/triple-slash-reference': 0
  },
  ignorePatterns: ['**/*.test.ts']
}
