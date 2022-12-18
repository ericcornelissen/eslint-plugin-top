// Check out ESLint at: https://eslint.org/

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  extends: ['eslint:recommended', 'plugin:eslint-plugin/all'],
  plugins: ['@typescript-eslint'],
  env: {
    node: true
  },
  rules: {
    '@typescript-eslint/no-unused-vars': 'error'
  },
  overrides: [
    {
      files: ['tests/**/*'],
      env: {mocha: true},
      rules: {
        'node/no-unpublished-import': 'off'
      }
    },
    {
      files: [
        '.github/**/*.json',
        '.licensee.json',
        'package-lock.json',
        'package.json',
        'tsconfig.json',
        '**/*.md/*.json'
      ],
      plugins: ['json'],
      rules: {
        'json/*': [
          'error',
          {
            allowComments: false
          }
        ]
      }
    },
    {
      files: [
        '.github/**/*.yml',
        '.markdownlint.yml',
        '.mocharc.yml',
        '.prettierrc.yml',
        '**/*.md/*.yml'
      ],
      extends: ['plugin:yml/base'],
      rules: {
        'yml/block-mapping': ['error', 'always'],
        'yml/block-mapping-colon-indicator-newline': ['error', 'never'],
        'yml/block-mapping-question-indicator-newline': ['error', 'never'],
        'yml/block-sequence': ['error', 'always'],
        'yml/block-sequence-hyphen-indicator-newline': ['error', 'never'],
        'yml/file-extension': [
          'error',
          {
            extension: 'yml',
            caseSensitive: true
          }
        ],
        'yml/indent': [
          'error',
          2,
          {
            indentBlockSequences: true
          }
        ],
        'yml/key-name-casing': 'off',
        'yml/key-spacing': [
          'error',
          {
            afterColon: true,
            beforeColon: false,
            mode: 'strict'
          }
        ],
        'yml/no-empty-document': 'error',
        'yml/no-empty-key': 'error',
        'yml/no-empty-mapping-value': 'error',
        'yml/no-empty-sequence-entry': 'error',
        'yml/no-irregular-whitespace': 'error',
        'yml/no-multiple-empty-lines': [
          'error',
          {
            max: 1,
            maxEOF: 0,
            maxBOF: 0
          }
        ],
        'yml/no-tab-indent': 'error',
        'yml/plain-scalar': ['error', 'always'],
        'yml/quotes': [
          'error',
          {
            avoidEscape: true,
            prefer: 'single'
          }
        ],
        'yml/require-string-key': 'error',
        'yml/sort-keys': 'off',
        'yml/sort-sequence-values': 'off',
        'yml/spaced-comment': ['error', 'always'],
        'yml/vue-custom-block/no-parsing-error': 'off'
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
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': 'off'
      }
    }
  ],
  ignorePatterns: [
    // Don't ignore configuration files
    '!.github/',
    '!.*.json',
    '!.*.yml',

    // Generated & temporary
    '.cache/',
    '.temp/',
    '_reports/',
    'node_modules/',
    'index.js'
  ]
};
