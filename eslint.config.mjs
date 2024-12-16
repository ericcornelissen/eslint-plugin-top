// Check out ESLint at: https://eslint.org/

import depend from 'eslint-plugin-depend';
import eslintPlugin from 'eslint-plugin-eslint-plugin';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import yml from 'eslint-plugin-yml';

export default [
  ...markdown.configs['processor'],
  ...yml.configs['flat/base'],

  {
    name: 'Code',
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      parser: tsparser,
      sourceType: 'module'
    }
  },
  {
    name: 'TypeScript Code',
    files: ['lib/**/*.ts'],
    plugins: {depend, tseslint},
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: '.'
      }
    },
    rules: {
      'depend/ban-dependencies': 'error',
      'tseslint/consistent-return': 'error',
      'tseslint/consistent-type-exports': 'error',
      'tseslint/consistent-type-imports': 'error',
      'tseslint/no-array-delete': 'error',
      'tseslint/no-confusing-void-expression': 'error',
      'tseslint/no-deprecated': 'error',
      'tseslint/no-duplicate-type-constituents': 'error',
      'tseslint/no-floating-promises': [
        'error',
        {
          ignoreIIFE: false,
          ignoreVoid: false
        }
      ],
      'tseslint/no-import-type-side-effects': 'error',
      'tseslint/no-mixed-enums': 'error',
      'tseslint/no-unnecessary-boolean-literal-compare': 'error',
      'tseslint/no-unused-vars': 'error',
      'tseslint/no-unsafe-enum-comparison': 'error',
      'tseslint/no-unsafe-unary-minus': 'error',
      'tseslint/no-unnecessary-template-expression': 'error',
      'tseslint/only-throw-error': [
        'error',
        {
          allowThrowingAny: false,
          allowThrowingUnknown: false
        }
      ],
      'tseslint/prefer-destructuring': 'error',
      'tseslint/prefer-find': 'error',
      'tseslint/prefer-promise-reject-errors': 'error',
      'tseslint/prefer-string-starts-ends-with': 'error',
      'tseslint/restrict-template-expressions': [
        'error',
        {
          allowAny: false,
          allowArray: false,
          allowBoolean: true,
          allowNever: false,
          allowNullish: false,
          allowNumber: true,
          allowRegExp: false
        }
      ],
      'tseslint/switch-exhaustiveness-check': [
        'error',
        {
          allowDefaultCaseForExhaustiveSwitch: false,
          requireDefaultForNonUnion: true
        }
      ],

      'consistent-return': 'off', // typescript/consistent-return used instead
      'no-throw-literal': 'off', // typescript/only-throw-error used instead
      'prefer-destructuring': 'off', //typescript/prefer-destructuring used instead
      'prefer-promise-reject-errors': 'off' // typescript/prefer-promise-reject-errors use instead
    }
  },
  {
    name: 'Tests',
    files: ['tests/**/*'],
    plugins: {depend, tseslint},
    rules: {
      'depend/ban-dependencies': 'error',
      'tseslint/no-unused-vars': 'error'
    }
  },
  {
    name: 'JSON',
    files: [
      '.github/**/*.json',
      '.licensee.json',
      '.c8rc.json',
      'knip.json',
      'package.json',
      'tsconfig.json',
      '**/*.md/*.json'
    ],
    plugins: {json},
    language: 'json/json',
    rules: {
      'json/no-duplicate-keys': 'error',
      'json/no-empty-keys': 'error',
      'json/no-unnormalized-keys': 'error',
      'json/no-unsafe-values': 'error',
      'json/top-level-interop': 'error'
    }
  },
  {
    name: 'YAML',
    files: [
      '.github/**/*.yml',
      '.lockfile-lintrc.yml',
      '.markdownlint.yml',
      '.mocharc.yml',
      '.prettierrc.yml',
      '**/*.md/*.yml'
    ],
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
    name: 'ESLint Plugin',
    ...eslintPlugin.configs['flat/recommended'],
    files: ['**/*.ts']
  },

  {
    ignores: ['.cache/', '.temp/', '_reports/', 'node_modules/', 'index.js']
  }
];
