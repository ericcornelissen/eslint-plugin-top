// Configuration file for ESLint (https://eslint.org/)

import depend from 'eslint-plugin-depend';
import plugin from 'eslint-plugin-eslint-plugin';
import imports from 'eslint-plugin-import';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import unicorn from 'eslint-plugin-unicorn';
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
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error'
    }
  },
  {
    name: 'TypeScript Code',
    files: ['lib/**/*.ts'],
    plugins: {depend, imports, tseslint, unicorn},
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    rules: {
      'depend/ban-dependencies': 'error',

      ...{
        'imports/consistent-type-specifier-style': 'error',
        'imports/default': 'error',
        'imports/export': 'error',
        'imports/enforce-node-protocol-usage': ['error', 'always'],
        'imports/exports-last': 'error',
        'imports/extensions': ['error', 'never'],
        'imports/first': 'error',
        'imports/group-exports': 'off',
        'imports/imports-first': 'error',
        'imports/max-dependencies': 'off',
        'imports/named': 'error',
        'imports/namespace': 'error',
        'imports/newline-after-import': 'error',
        'imports/no-absolute-path': 'error',
        'imports/no-amd': 'error',
        'imports/no-anonymous-default-export': 'error',
        'imports/no-commonjs': 'error',
        'imports/no-cycle': 'error',
        'imports/no-default-export': 'error',
        'imports/no-deprecated': 'error',
        'imports/no-duplicates': 'error',
        'imports/no-dynamic-require': 'error',
        'imports/no-empty-named-blocks': 'error',
        'imports/no-extraneous-dependencies': 'error',
        'imports/no-import-module-exports': 'error',
        'imports/no-internal-modules': 'off',
        'imports/no-mutable-exports': 'error',
        'imports/no-named-as-default': 'error',
        'imports/no-named-as-default-member': 'error',
        'imports/no-named-default': 'error',
        'imports/no-named-export': 'off',
        'imports/no-namespace': 'off',
        'imports/no-nodejs-modules': 'off',
        'imports/no-relative-packages': 'error',
        'imports/no-relative-parent-imports': 'off',
        'imports/no-restricted-paths': 'error',
        'imports/no-self-import': 'error',
        'imports/no-unassigned-import': 'error',
        'imports/no-unresolved': 'error',
        'imports/no-unused-modules': 'error',
        'imports/no-useless-path-segments': 'error',
        'imports/no-webpack-loader-syntax': 'error',
        'imports/order': [
          'error',
          {
            alphabetize: {
              order: 'asc',
              caseInsensitive: true
            },
            'newlines-between': 'always'
          }
        ],
        'imports/prefer-default-export': 'off',
        'imports/unambiguous': 'error'
      },

      ...{
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
      },

      ...{
        'unicorn/better-regex': 'error',
        'unicorn/catch-error-name': 'error',
        'unicorn/consistent-assert': 'error',
        'unicorn/consistent-date-clone': 'error',
        'unicorn/consistent-destructuring': 'error',
        'unicorn/consistent-empty-array-spread': 'error',
        'unicorn/consistent-existence-index-check': 'error',
        'unicorn/consistent-function-scoping': 'error',
        'unicorn/custom-error-definition': 'error',
        'unicorn/empty-brace-spaces': 'error',
        'unicorn/error-message': 'error',
        'unicorn/escape-case': 'error',
        'unicorn/expiring-todo-comments': 'error',
        'unicorn/explicit-length-check': 'error',
        'unicorn/filename-case': 'error',
        'unicorn/import-style': 'error',
        'unicorn/new-for-builtins': 'error',
        'unicorn/no-abusive-eslint-disable': 'error',
        'unicorn/no-accessor-recursion': 'error',
        'unicorn/no-anonymous-default-export': 'error',
        'unicorn/no-array-callback-reference': 'error',
        'unicorn/no-array-for-each': 'error',
        'unicorn/no-array-method-this-argument': 'error',
        'unicorn/no-array-reduce': 'error',
        'unicorn/no-array-reverse': 'error',
        'unicorn/no-array-sort': 'error',
        'unicorn/no-await-expression-member': 'error',
        'unicorn/no-await-in-promise-methods': 'error',
        'unicorn/no-console-spaces': 'error',
        'unicorn/no-document-cookie': 'error',
        'unicorn/no-empty-file': 'error',
        'unicorn/no-for-loop': 'error',
        'unicorn/no-hex-escape': 'error',
        'unicorn/no-immediate-mutation': 'error',
        'unicorn/no-instanceof-builtins': 'error',
        'unicorn/no-invalid-fetch-options': 'error',
        'unicorn/no-invalid-remove-event-listener': 'error',
        'unicorn/no-keyword-prefix': 'error',
        'unicorn/no-lonely-if': 'error',
        'unicorn/no-magic-array-flat-depth': 'error',
        'unicorn/no-named-default': 'error',
        'unicorn/no-negated-condition': 'error',
        'unicorn/no-negation-in-equality-check': 'error',
        'unicorn/no-nested-ternary': 'error',
        'unicorn/no-new-array': 'error',
        'unicorn/no-new-buffer': 'error',
        'unicorn/no-null': 'error',
        'unicorn/no-object-as-default-parameter': 'error',
        'unicorn/no-process-exit': 'error',
        'unicorn/no-single-promise-in-promise-methods': 'error',
        'unicorn/no-static-only-class': 'error',
        'unicorn/no-thenable': 'error',
        'unicorn/no-this-assignment': 'error',
        'unicorn/no-typeof-undefined': 'error',
        'unicorn/no-unnecessary-array-flat-depth': 'error',
        'unicorn/no-unnecessary-array-splice-count': 'error',
        'unicorn/no-unnecessary-await': 'error',
        'unicorn/no-unnecessary-polyfills': 'error',
        'unicorn/no-unnecessary-slice-end': 'error',
        'unicorn/no-unreadable-array-destructuring': 'error',
        'unicorn/no-unreadable-iife': 'error',
        'unicorn/no-unused-properties': 'error',
        'unicorn/no-useless-collection-argument': 'error',
        'unicorn/no-useless-error-capture-stack-trace': 'error',
        'unicorn/no-useless-fallback-in-spread': 'error',
        'unicorn/no-useless-length-check': 'error',
        'unicorn/no-useless-promise-resolve-reject': 'error',
        'unicorn/no-useless-spread': 'error',
        'unicorn/no-useless-switch-case': 'error',
        'unicorn/no-useless-undefined': 'error',
        'unicorn/no-zero-fractions': 'error',
        'unicorn/number-literal-case': 'error',
        'unicorn/numeric-separators-style': 'error',
        'unicorn/prefer-add-event-listener': 'error',
        'unicorn/prefer-array-find': 'error',
        'unicorn/prefer-array-flat-map': 'error',
        'unicorn/prefer-array-flat': 'error',
        'unicorn/prefer-array-index-of': 'error',
        'unicorn/prefer-array-some': 'error',
        'unicorn/prefer-at': 'error',
        'unicorn/prefer-bigint-literals': 'error',
        'unicorn/prefer-blob-reading-methods': 'error',
        'unicorn/prefer-classlist-toggle': 'off',
        'unicorn/prefer-class-fields': 'error',
        'unicorn/prefer-code-point': 'error',
        'unicorn/prefer-date-now': 'error',
        'unicorn/prefer-default-parameters': 'error',
        'unicorn/prefer-dom-node-append': 'error',
        'unicorn/prefer-dom-node-dataset': 'error',
        'unicorn/prefer-dom-node-remove': 'error',
        'unicorn/prefer-dom-node-text-content': 'error',
        'unicorn/prefer-event-target': 'error',
        'unicorn/prefer-export-from': 'error',
        'unicorn/prefer-global-this': 'error',
        'unicorn/prefer-import-meta-properties': 'error',
        'unicorn/prefer-includes': 'error',
        'unicorn/prefer-json-parse-buffer': 'error',
        'unicorn/prefer-keyboard-event-key': 'error',
        'unicorn/prefer-logical-operator-over-ternary': 'error',
        'unicorn/prefer-math-min-max': 'error',
        'unicorn/prefer-math-trunc': 'error',
        'unicorn/prefer-modern-dom-apis': 'error',
        'unicorn/prefer-modern-math-apis': 'error',
        'unicorn/prefer-module': 'error',
        'unicorn/prefer-native-coercion-functions': 'error',
        'unicorn/prefer-negative-index': 'error',
        'unicorn/prefer-node-protocol': 'error',
        'unicorn/prefer-number-properties': 'error',
        'unicorn/prefer-object-from-entries': 'error',
        'unicorn/prefer-optional-catch-binding': 'error',
        'unicorn/prefer-prototype-methods': 'error',
        'unicorn/prefer-query-selector': 'error',
        'unicorn/prefer-reflect-apply': 'error',
        'unicorn/prefer-regexp-test': 'error',
        'unicorn/prefer-response-static-json': 'off',
        'unicorn/prefer-set-has': 'error',
        'unicorn/prefer-set-size': 'error',
        'unicorn/prefer-single-call': 'error',
        'unicorn/prefer-spread': 'error',
        'unicorn/prefer-string-raw': 'error',
        'unicorn/prefer-string-replace-all': 'error',
        'unicorn/prefer-string-slice': 'error',
        'unicorn/prefer-string-starts-ends-with': 'error',
        'unicorn/prefer-string-trim-start-end': 'error',
        'unicorn/prefer-structured-clone': 'error',
        'unicorn/prefer-switch': 'error',
        'unicorn/prefer-ternary': 'error',
        'unicorn/prefer-top-level-await': 'error',
        'unicorn/prefer-type-error': 'error',
        'unicorn/prevent-abbreviations': 'off',
        'unicorn/relative-url-style': 'error',
        'unicorn/require-array-join-separator': 'error',
        'unicorn/require-module-attributes': 'error',
        'unicorn/require-module-specifiers': 'error',
        'unicorn/require-number-to-fixed-digits-argument': 'error',
        'unicorn/require-post-message-target-origin': 'error',
        'unicorn/string-content': 'error',
        'unicorn/switch-case-braces': 'error',
        'unicorn/template-indent': 'error',
        'unicorn/text-encoding-identifier-case': 'error',
        'unicorn/throw-new-error': 'error'
      }
    },
    settings: {
      'import/resolver': 'typescript'
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
      'package.json',
      'tsconfig.json',
      '**/*.md/*.json'
    ],
    plugins: {json},
    language: 'json/json',
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error'
    },
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
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
      reportUnusedInlineConfigs: 'error'
    },
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
    ...plugin.configs['flat/recommended'],
    files: ['**/*.ts']
  },

  {
    ignores: ['.cache/', '.temp/', '_reports/', 'node_modules/', 'index.js']
  }
];
