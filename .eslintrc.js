// Check out ESLint at: https://eslint.org/

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  extends: [
    'eslint:recommended',
    'plugin:eslint-plugin/recommended',
    'plugin:node/recommended'
  ],
  plugins: ['@typescript-eslint'],
  env: {
    node: true
  },
  rules: {
    'node/no-unsupported-features/es-syntax': 0,
    'node/no-missing-import': [
      'error',
      {
        allowModules: ['estree'],
        resolvePaths: ['/path/to/a/modules/directory'],
        tryExtensions: ['.js', '.json', '.node', '.ts']
      }
    ],
    '@typescript-eslint/no-unused-vars': 'error'
  },
  overrides: [
    {
      files: ['tests/**/*'],
      env: {mocha: true},
      rules: {
        'node/no-unpublished-import': 0
      }
    },
    {
      files: ['rollup.config.ts'],
      rules: {
        'node/no-unpublished-import': 0
      }
    },
    {
      files: ['**/*.md'],
      plugins: ['markdown'],
      processor: 'markdown/markdown'
    },
    {
      files: ['**/*.md/*.javascript'],
      rules: {
        'no-unused-expressions': 'off',
        'no-unused-vars': 'off'
      }
    }
  ]
};
