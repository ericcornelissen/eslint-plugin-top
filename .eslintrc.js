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
  overrides: [
    {
      files: ['lib/**/*.ts'],
      parserOptions: {
        project: './tsconfig.json'
      },
      rules: {
        '@typescript-eslint/block-spacing': 'error',
        '@typescript-eslint/consistent-type-exports': 'error',
        '@typescript-eslint/consistent-type-imports': 'error',
        '@typescript-eslint/key-spacing': 'error',
        '@typescript-eslint/lines-around-comment': 'error',
        '@typescript-eslint/member-delimiter-style': [
          'error',
          {
            multiline: {
              delimiter: 'semi',
              requireLast: true
            },
            singleline: {
              delimiter: 'semi',
              requireLast: true
            },
            multilineDetection: 'brackets'
          }
        ],
        '@typescript-eslint/no-confusing-void-expression': 'error',
        '@typescript-eslint/no-duplicate-type-constituents': 'error',
        '@typescript-eslint/no-import-type-side-effects': 'error',
        '@typescript-eslint/no-mixed-enums': 'error',
        '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-unsafe-enum-comparison': 'error',
        '@typescript-eslint/no-unsafe-unary-minus': 'error',
        '@typescript-eslint/prefer-destructuring': 'error',
        '@typescript-eslint/switch-exhaustiveness-check': 'error',

        'block-spacing': 'off', // @typescript-eslint/block-spacing used instead
        'key-spacing': 'off', // @typescript-eslint/key-spacing used instead
        'lines-around-comment': 'off', // @typescript-eslint/lines-around-comment used instead
        'prefer-destructuring': 'off' //@typescript-eslint/prefer-destructuring used instead
      }
    },
    {
      files: ['tests/**/*'],
      env: {mocha: true},
      rules: {
        '@typescript-eslint/no-unused-vars': 'error'
      }
    },
    {
      files: [
        '.github/**/*.json',
        '.licensee.json',
        'knip.json',
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
      parser: 'yaml-eslint-parser',
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
        'yml/no-trailing-zeros': 'error',
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
