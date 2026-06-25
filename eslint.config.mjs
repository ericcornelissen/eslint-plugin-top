// Configuration file for ESLint (https://eslint.org/)

import * as process from 'node:process';

import depend from 'eslint-plugin-depend';
import plugin from 'eslint-plugin-eslint-plugin';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import regexp from 'eslint-plugin-regexp';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import unicorn from 'eslint-plugin-unicorn';
import yml from 'eslint-plugin-yml';

export default [
  ...yml.configs.base,

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
    plugins: {depend, regexp, tseslint, unicorn},
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    rules: {
      'depend/ban-dependencies': 'error',

      ...{
        'regexp/confusing-quantifier': 'error',
        'regexp/control-character-escape': 'error',
        'regexp/grapheme-string-literal': 'error',
        'regexp/hexadecimal-escape': ['error', 'never'],
        'regexp/letter-case': [
          'error',
          {
            caseInsensitive: 'lowercase',
            controlEscape: 'lowercase',
            hexadecimalEscape: 'uppercase',
            unicodeEscape: 'uppercase'
          }
        ],
        'regexp/match-any': 'error',
        'regexp/negation': 'error',
        'regexp/no-contradiction-with-assertion': 'error',
        'regexp/no-control-character': 'error',
        'regexp/no-dupe-characters-character-class': 'error',
        'regexp/no-dupe-disjunctions': [
          'error',
          {
            report: 'all',
            reportExponentialBacktracking: 'potential',
            reportUnreachable: 'potential'
          }
        ],
        'regexp/no-empty-alternative': 'error',
        'regexp/no-empty-capturing-group': 'error',
        'regexp/no-empty-character-class': 'error',
        'regexp/no-empty-group': 'error',
        'regexp/no-empty-lookarounds-assertion': 'error',
        'regexp/no-empty-string-literal': 'error',
        'regexp/no-escape-backspace': 'error',
        'regexp/no-extra-lookaround-assertions': 'error',
        'regexp/no-invalid-regexp': 'error',
        'regexp/no-invisible-character': 'error',
        'regexp/no-lazy-ends': [
          'error',
          {
            ignorePartial: false
          }
        ],
        'regexp/no-legacy-features': 'error',
        'regexp/no-misleading-capturing-group': [
          'error',
          {
            reportBacktrackingEnds: true
          }
        ],
        'regexp/no-misleading-unicode-character': [
          'error',
          {
            fixable: false
          }
        ],
        'regexp/no-missing-g-flag': [
          'error',
          {
            strictTypes: true
          }
        ],
        'regexp/no-non-standard-flag': 'error',
        'regexp/no-obscure-range': 'error',
        'regexp/no-octal': 'error',
        'regexp/no-optional-assertion': 'error',
        'regexp/no-potentially-useless-backreference': 'error',
        'regexp/no-standalone-backslash': 'error',
        'regexp/no-super-linear-backtracking': [
          'error',
          {
            report: 'potential'
          }
        ],
        'regexp/no-super-linear-move': [
          'error',
          {
            ignoreSticky: false,
            report: 'potential'
          }
        ],
        'regexp/no-trivially-nested-assertion': 'error',
        'regexp/no-trivially-nested-quantifier': 'error',
        'regexp/no-unused-capturing-group': [
          'error',
          {
            allowNamed: false,
            fixable: false
          }
        ],
        'regexp/no-useless-assertions': 'error',
        'regexp/no-useless-backreference': 'error',
        'regexp/no-useless-character-class': 'error',
        'regexp/no-useless-dollar-replacements': 'error',
        'regexp/no-useless-escape': 'error',
        'regexp/no-useless-flag': 'error',
        'regexp/no-useless-lazy': 'error',
        'regexp/no-useless-non-capturing-group': 'error',
        'regexp/no-useless-quantifier': 'error',
        'regexp/no-useless-range': 'error',
        'regexp/no-useless-set-operand': 'error',
        'regexp/no-useless-string-literal': 'error',
        'regexp/no-useless-two-nums-quantifier': 'error',
        'regexp/no-zero-quantifier': 'error',
        'regexp/optimal-lookaround-quantifier': 'error',
        'regexp/optimal-quantifier-concatenation': [
          'error',
          {
            capturingGroups: 'report'
          }
        ],
        'regexp/prefer-character-class': [
          'error',
          {
            minAlternatives: 2
          }
        ],
        'regexp/prefer-d': [
          'error',
          {
            insideCharacterClass: 'range'
          }
        ],
        'regexp/prefer-escape-replacement-dollar-char': 'error',
        'regexp/prefer-lookaround': [
          'error',
          {
            lookbehind: true,
            strictTypes: true
          }
        ],
        'regexp/prefer-named-backreference': 'error',
        'regexp/prefer-named-capture-group': 'error',
        'regexp/prefer-named-replacement': 'error',
        'regexp/prefer-plus-quantifier': 'error',
        'regexp/prefer-predefined-assertion': 'error',
        'regexp/prefer-quantifier': 'error',
        'regexp/prefer-question-quantifier': 'error',
        'regexp/prefer-range': 'error',
        'regexp/prefer-regexp-exec': 'error',
        'regexp/prefer-regexp-test': 'error',
        'regexp/prefer-result-array-groups': 'error',
        'regexp/prefer-set-operation': 'error',
        'regexp/prefer-star-quantifier': 'error',
        'regexp/prefer-unicode-codepoint-escapes': 'error',
        'regexp/prefer-w': 'error',
        'regexp/require-unicode-regexp': 'error',
        'regexp/require-unicode-sets-regexp': 'error',
        'regexp/simplify-set-operations': 'error',
        'regexp/sort-alternatives': 'error',
        'regexp/sort-character-class-elements': [
          'error',
          {
            order: ['\\s', '\\w', '\\d', '\\p', '*']
          }
        ],
        'regexp/sort-flags': 'error',
        'regexp/strict': 'error',
        'regexp/unicode-escape': ['error', 'unicodeEscape'],
        'regexp/unicode-property': 'error',
        'regexp/use-ignore-case': 'error'
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
        'tseslint/no-unused-private-class-members': 'error',
        'tseslint/no-unsafe-enum-comparison': 'error',
        'tseslint/no-unsafe-unary-minus': 'error',
        'tseslint/no-unnecessary-template-expression': 'error',
        'tseslint/no-useless-default-assignment': 'error',
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
        'tseslint/strict-void-return': 'error',
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
        'unicorn/better-dom-traversing': 'off',
        'unicorn/catch-error-name': 'error',
        'unicorn/class-reference-in-static-methods': 'error',
        'unicorn/comment-content': 'error',
        'unicorn/consistent-assert': 'error',
        'unicorn/consistent-boolean-name': 'error',
        'unicorn/consistent-class-member-order': 'error',
        'unicorn/consistent-compound-words': 'error',
        'unicorn/consistent-conditional-object-spread': 'error',
        'unicorn/consistent-date-clone': 'error',
        'unicorn/consistent-destructuring': 'error',
        'unicorn/consistent-empty-array-spread': 'error',
        'unicorn/consistent-existence-index-check': 'error',
        'unicorn/consistent-export-decorator-position': 'error',
        'unicorn/consistent-function-scoping': 'error',
        'unicorn/consistent-function-style': 'error',
        'unicorn/consistent-json-file-read': ['error', 'string'],
        'unicorn/consistent-optional-chaining': 'error',
        'unicorn/consistent-template-literal-escape': 'error',
        'unicorn/custom-error-definition': 'error',
        'unicorn/default-export-style': 'error',
        'unicorn/dom-node-dataset': 'off',
        'unicorn/empty-brace-spaces': 'error',
        'unicorn/error-message': 'error',
        'unicorn/escape-case': 'error',
        'unicorn/expiring-todo-comments': 'error',
        'unicorn/explicit-timer-delay': 'error',
        'unicorn/explicit-length-check': 'error',
        'unicorn/filename-case': 'error',
        'unicorn/id-match': 'error',
        'unicorn/import-style': 'error',
        'unicorn/isolated-functions': 'error',
        'unicorn/logical-assignment-operators': 'error',
        'unicorn/max-nested-calls': 'error',
        'unicorn/name-replacements': [
          'error',
          {
            replacements: {
              var: false
            }
          }
        ],
        'unicorn/new-for-builtins': 'error',
        'unicorn/no-abusive-eslint-disable': 'error',
        'unicorn/no-accessor-recursion': 'error',
        'unicorn/no-accidental-bitwise-operator': 'error',
        'unicorn/no-anonymous-default-export': 'error',
        'unicorn/no-array-callback-reference': 'error',
        'unicorn/no-array-concat-in-loop': 'error',
        'unicorn/no-array-fill-with-reference-type': 'error',
        'unicorn/no-array-from-fill': 'error',
        'unicorn/no-array-front-mutation': 'error',
        'unicorn/no-array-method-this-argument': 'error',
        'unicorn/no-array-reduce': 'error',
        'unicorn/no-array-reverse': 'error',
        'unicorn/no-array-sort': 'error',
        'unicorn/no-array-sort-for-min-max': 'error',
        'unicorn/no-array-splice': 'error',
        'unicorn/no-asterisk-prefix-in-documentation-comments': 'off',
        'unicorn/no-await-expression-member': 'error',
        'unicorn/no-await-in-promise-methods': 'error',
        'unicorn/no-blob-to-file': 'error',
        'unicorn/no-boolean-sort-comparator': 'error',
        'unicorn/no-break-in-nested-loop': 'error',
        'unicorn/no-canvas-to-image': 'error',
        'unicorn/no-chained-comparison': 'error',
        'unicorn/no-collection-bracket-access': 'error',
        'unicorn/no-computed-property-existence-check': 'error',
        'unicorn/no-confusing-array-splice': 'error',
        'unicorn/no-confusing-array-with': 'error',
        'unicorn/no-console-spaces': 'error',
        'unicorn/no-constant-zero-expression': 'error',
        'unicorn/no-declarations-before-early-exit': 'error',
        'unicorn/no-document-cookie': 'error',
        'unicorn/no-double-comparison': 'error',
        'unicorn/no-duplicate-if-branches': 'error',
        'unicorn/no-duplicate-logical-operands': 'error',
        'unicorn/no-duplicate-loops': 'error',
        'unicorn/no-duplicate-set-values': 'error',
        'unicorn/no-empty-file': 'error',
        'unicorn/no-error-property-assignment': 'error',
        'unicorn/no-exports-in-scripts': 'error',
        'unicorn/no-for-each': 'error',
        'unicorn/no-for-loop': 'error',
        'unicorn/no-global-object-property-assignment': 'error',
        'unicorn/no-immediate-mutation': 'error',
        'unicorn/no-impossible-length-comparison': 'error',
        'unicorn/no-incorrect-query-selector': 'off',
        'unicorn/no-incorrect-template-string-interpolation': 'error',
        'unicorn/no-instanceof-builtins': 'error',
        'unicorn/no-invalid-argument-count': 'error',
        'unicorn/no-invalid-character-comparison': 'error',
        'unicorn/no-invalid-fetch-options': 'error',
        'unicorn/no-invalid-file-input-accept': 'off',
        'unicorn/no-invalid-remove-event-listener': 'error',
        'unicorn/no-keyword-prefix': 'error',
        'unicorn/no-late-current-target-access': 'off',
        'unicorn/no-lonely-if': 'error',
        'unicorn/no-loop-iterable-mutation': 'error',
        'unicorn/no-magic-array-flat-depth': 'error',
        'unicorn/no-manually-wrapped-comments': 'off',
        'unicorn/no-mismatched-map-key': 'error',
        'unicorn/no-misrefactored-assignment': 'error',
        'unicorn/no-named-default': 'error',
        'unicorn/no-negated-array-predicate': 'error',
        'unicorn/no-negated-comparison': 'error',
        'unicorn/no-negated-condition': 'error',
        'unicorn/no-negation-in-equality-check': 'error',
        'unicorn/no-nested-ternary': 'error',
        'unicorn/no-new-array': 'error',
        'unicorn/no-new-buffer': 'error',
        'unicorn/no-non-function-verb-prefix': 'error',
        'unicorn/no-nonstandard-builtin-properties': 'error',
        'unicorn/no-null': 'error',
        'unicorn/no-object-as-default-parameter': 'error',
        'unicorn/no-object-methods-with-collections': 'error',
        'unicorn/no-optional-chaining-on-undeclared-variable': 'error',
        'unicorn/no-process-exit': 'error',
        'unicorn/no-redundant-comparison': 'error',
        'unicorn/no-return-array-push': 'error',
        'unicorn/no-selector-as-dom-name': 'off',
        'unicorn/no-single-promise-in-promise-methods': 'error',
        'unicorn/no-static-only-class': 'error',
        'unicorn/no-subtraction-comparison': 'error',
        'unicorn/no-thenable': 'error',
        'unicorn/no-this-assignment': 'error',
        'unicorn/no-this-outside-of-class': 'error',
        'unicorn/no-top-level-side-effects': 'off',
        'unicorn/no-top-level-assignment-in-function': 'off',
        'unicorn/no-typeof-undefined': 'error',
        'unicorn/no-uncalled-method': 'error',
        'unicorn/no-undeclared-class-members': 'error',
        'unicorn/no-unnecessary-array-flat-depth': 'error',
        'unicorn/no-unnecessary-array-splice-count': 'error',
        'unicorn/no-unnecessary-await': 'error',
        'unicorn/no-unnecessary-boolean-comparison': 'error',
        'unicorn/no-unnecessary-global-this': 'error',
        'unicorn/no-unnecessary-nested-ternary': 'error',
        'unicorn/no-unnecessary-polyfills': 'error',
        'unicorn/no-unnecessary-slice-end': 'error',
        'unicorn/no-unnecessary-splice': 'error',
        'unicorn/no-unreadable-array-destructuring': 'error',
        'unicorn/no-unreadable-for-of-expression': 'error',
        'unicorn/no-unreadable-iife': 'error',
        'unicorn/no-unreadable-new-expression': 'error',
        'unicorn/no-unreadable-object-destructuring': 'error',
        'unicorn/no-unsafe-buffer-conversion': 'error',
        'unicorn/no-unsafe-dom-html': 'error',
        'unicorn/no-unsafe-property-key': 'error',
        'unicorn/no-unsafe-string-replacement': 'error',
        'unicorn/no-unused-array-method-return': 'error',
        'unicorn/no-unused-properties': 'error',
        'unicorn/no-useless-boolean-cast': 'error',
        'unicorn/no-useless-coercion': 'error',
        'unicorn/no-useless-collection-argument': 'error',
        'unicorn/no-useless-compound-assignment': 'error',
        'unicorn/no-useless-concat': 'error',
        'unicorn/no-useless-continue': 'error',
        'unicorn/no-useless-delete-check': 'error',
        'unicorn/no-useless-else': 'error',
        'unicorn/no-useless-error-capture-stack-trace': 'error',
        'unicorn/no-useless-fallback-in-spread': 'error',
        'unicorn/no-useless-iterator-to-array': 'error',
        'unicorn/no-useless-length-check': 'error',
        'unicorn/no-useless-logical-operand': 'error',
        'unicorn/no-useless-override': 'error',
        'unicorn/no-useless-promise-resolve-reject': 'error',
        'unicorn/no-useless-recursion': 'error',
        'unicorn/no-useless-spread': 'error',
        'unicorn/no-useless-switch-case': 'error',
        'unicorn/no-useless-template-literals': 'error',
        'unicorn/no-useless-undefined': 'error',
        'unicorn/no-xor-as-exponentiation': 'error',
        'unicorn/no-zero-fractions': 'error',
        'unicorn/number-literal-case': 'error',
        'unicorn/numeric-separators-style': 'error',
        'unicorn/operator-assignment': 'error',
        'unicorn/prefer-add-event-listener': 'off',
        'unicorn/prefer-add-event-listener-options': 'off',
        'unicorn/prefer-array-find': 'error',
        'unicorn/prefer-array-flat-map': 'error',
        'unicorn/prefer-array-flat': 'error',
        'unicorn/prefer-array-from-async': 'error',
        'unicorn/prefer-array-from-map': 'error',
        'unicorn/prefer-array-index-of': 'error',
        'unicorn/prefer-array-iterable-methods': 'error',
        'unicorn/prefer-array-last-methods': 'error',
        'unicorn/prefer-array-slice': 'error',
        'unicorn/prefer-array-some': 'error',
        'unicorn/prefer-at': 'error',
        'unicorn/prefer-await': 'error',
        'unicorn/prefer-bigint-literals': 'error',
        'unicorn/prefer-blob-reading-methods': 'error',
        'unicorn/prefer-boolean-return': 'error',
        'unicorn/prefer-classlist-toggle': 'off',
        'unicorn/prefer-class-fields': 'error',
        'unicorn/prefer-code-point': 'error',
        'unicorn/prefer-continue': 'error',
        'unicorn/prefer-date-now': 'error',
        'unicorn/prefer-default-parameters': 'error',
        'unicorn/prefer-dom-node-append': 'error',
        'unicorn/prefer-dom-node-html-methods': 'off',
        'unicorn/prefer-dom-node-remove': 'error',
        'unicorn/prefer-dom-node-text-content': 'error',
        'unicorn/prefer-direct-iteration': 'error',
        'unicorn/prefer-dispose': 'error',
        'unicorn/prefer-early-return': 'error',
        'unicorn/prefer-else-if': 'error',
        'unicorn/prefer-event-target': 'error',
        'unicorn/prefer-export-from': 'error',
        'unicorn/prefer-flat-math-min-max': 'error',
        'unicorn/prefer-get-or-insert-computed': 'error',
        'unicorn/prefer-global-number-constants': 'error',
        'unicorn/prefer-global-this': 'error',
        'unicorn/prefer-has-check': 'error',
        'unicorn/prefer-hoisting-branch-code': 'error',
        'unicorn/prefer-https': 'error',
        'unicorn/prefer-identifier-import-export-specifiers': 'error',
        'unicorn/prefer-import-meta-properties': 'error',
        'unicorn/prefer-includes': 'error',
        'unicorn/prefer-includes-over-repeated-comparisons': 'error',
        'unicorn/prefer-iterable-in-constructor': 'error',
        'unicorn/prefer-iterator-concat': 'error',
        'unicorn/prefer-iterator-to-array': 'error',
        'unicorn/prefer-iterator-to-array-at-end': 'error',
        'unicorn/prefer-keyboard-event-key': 'error',
        'unicorn/prefer-location-assign': 'off',
        'unicorn/prefer-logical-operator-over-ternary': 'error',
        'unicorn/prefer-map-from-entries': 'error',
        'unicorn/prefer-math-abs': 'error',
        'unicorn/prefer-math-constants': 'error',
        'unicorn/prefer-math-min-max': 'error',
        'unicorn/prefer-math-trunc': 'error',
        'unicorn/prefer-minimal-ternary': 'off',
        'unicorn/prefer-modern-dom-apis': 'error',
        'unicorn/prefer-modern-math-apis': 'error',
        'unicorn/prefer-module': 'error',
        'unicorn/prefer-native-coercion-functions': 'error',
        'unicorn/prefer-negative-index': 'error',
        'unicorn/prefer-node-protocol': 'error',
        'unicorn/prefer-number-coercion': 'error',
        'unicorn/prefer-number-is-safe-integer': 'error',
        'unicorn/prefer-number-properties': 'error',
        'unicorn/prefer-object-define-properties': 'error',
        'unicorn/prefer-object-destructuring-defaults': 'error',
        'unicorn/prefer-object-from-entries': 'error',
        'unicorn/prefer-object-iterable-methods': 'error',
        'unicorn/prefer-optional-catch-binding': 'error',
        'unicorn/prefer-path2d': 'off',
        'unicorn/prefer-private-class-fields': 'error',
        'unicorn/prefer-promise-with-resolvers': 'error',
        'unicorn/prefer-prototype-methods': 'error',
        'unicorn/prefer-query-selector': 'error',
        'unicorn/prefer-queue-microtask': 'error',
        'unicorn/prefer-reflect-apply': 'error',
        'unicorn/prefer-regexp-escape': 'error',
        'unicorn/prefer-regexp-test': 'error',
        'unicorn/prefer-response-static-json': 'off',
        'unicorn/prefer-scoped-selector': 'off',
        'unicorn/prefer-set-has': 'error',
        'unicorn/prefer-set-size': 'error',
        'unicorn/prefer-short-arrow-method': 'error',
        'unicorn/prefer-simple-condition-first': 'error',
        'unicorn/prefer-simple-sort-comparator': 'error',
        'unicorn/prefer-single-array-predicate': 'error',
        'unicorn/prefer-single-call': 'error',
        'unicorn/prefer-single-object-destructuring': 'error',
        'unicorn/prefer-single-replace': 'error',
        'unicorn/prefer-smaller-scope': 'error',
        'unicorn/prefer-split-limit': 'error',
        'unicorn/prefer-spread': 'error',
        'unicorn/prefer-string-match-all': 'error',
        'unicorn/prefer-string-pad-start-end': 'error',
        'unicorn/prefer-string-repeat': 'error',
        'unicorn/prefer-string-replace-all': 'error',
        'unicorn/prefer-string-raw': 'off',
        'unicorn/prefer-string-slice': 'error',
        'unicorn/prefer-string-starts-ends-with': 'error',
        'unicorn/prefer-string-trim-start-end': 'error',
        'unicorn/prefer-structured-clone': 'error',
        'unicorn/prefer-switch': 'error',
        'unicorn/prefer-temporal': 'off',
        'unicorn/prefer-ternary': 'off',
        'unicorn/prefer-top-level-await': 'error',
        'unicorn/prefer-type-error': 'error',
        'unicorn/prefer-type-literal-last': 'error',
        'unicorn/prefer-uint8array-base64': 'error',
        'unicorn/prefer-unary-minus': 'error',
        'unicorn/prefer-unicode-code-point-escapes': 'error',
        'unicorn/prefer-url-can-parse': 'error',
        'unicorn/prefer-url-href': 'error',
        'unicorn/prefer-while-loop-condition': 'error',
        'unicorn/relative-url-style': 'error',
        'unicorn/require-array-join-separator': 'error',
        'unicorn/require-array-sort-compare': 'error',
        'unicorn/require-css-escape': 'off',
        'unicorn/require-module-attributes': 'error',
        'unicorn/require-module-specifiers': 'error',
        'unicorn/require-number-to-fixed-digits-argument': 'error',
        'unicorn/require-passive-events': 'off',
        'unicorn/require-post-message-target-origin': 'error',
        'unicorn/require-proxy-trap-boolean-return': 'error',
        'unicorn/string-content': 'error',
        'unicorn/switch-case-braces': 'error',
        'unicorn/switch-case-break-position': 'error',
        'unicorn/template-indent': 'error',
        'unicorn/text-encoding-identifier-case': 'error',
        'unicorn/throw-new-error': 'error',
        'unicorn/try-complexity': 'error'
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
      'json/sort-keys': 'off',
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
      'yml/flow-mapping-curly-newline': 'error',
      'yml/flow-mapping-curly-spacing': 'error',
      'yml/flow-sequence-bracket-newline': 'error',
      'yml/flow-sequence-bracket-spacing': 'error',
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
  ...(process.argv.includes('**/*.md**')
    ? [
        {
          name: 'Documentation Snippets',
          files: ['**/*.md/*.js'],
          plugins: {unicorn},
          rules: {
            'id-length': 'off',
            'no-console': 'off',
            'no-magic-numbers': 'off',
            'no-undef': 'off',
            'no-unused-vars': 'off',

            // https://github.com/sindresorhus/eslint-plugin-unicorn#readme
            'unicorn/filename-case': 'off',
            'unicorn/no-useless-template-literals': 'off',
            'unicorn/switch-case-braces': 'off',
            'unicorn/try-complexity': 'off'
          }
        },
        {
          name: 'MarkDown processor',
          files: ['**/*.md'],
          plugins: {
            markdown
          },
          processor: 'markdown/markdown'
        }
      ]
    : [
        {
          name: 'Documentation',
          files: ['**/*.md'],
          language: 'markdown/commonmark',
          plugins: {
            markdown
          },
          rules: {
            'markdown/fenced-code-language': 'error',
            'markdown/fenced-code-meta': ['error', 'never'],
            'markdown/heading-increment': 'error',
            'markdown/no-bare-urls': 'error',
            'markdown/no-duplicate-definitions': [
              'error',
              {
                allowDefinitions: [],
                allowFootnoteDefinitions: []
              }
            ],
            'markdown/no-duplicate-headings': [
              'error',
              {
                checkSiblingsOnly: true
              }
            ],
            'markdown/no-empty-definitions': [
              'error',
              {
                allowDefinitions: [],
                allowFootnoteDefinitions: [],
                checkFootnoteDefinitions: true
              }
            ],
            'markdown/no-empty-images': 'error',
            'markdown/no-empty-links': 'error',
            'markdown/no-html': [
              'error',
              {
                allowed: [],
                allowedIgnoreCase: false
              }
            ],
            'markdown/no-invalid-label-refs': 'error',
            'markdown/no-missing-atx-heading-space': [
              'error',
              {
                checkClosedHeadings: true
              }
            ],
            'markdown/no-missing-label-refs': 'error',
            'markdown/no-missing-link-fragments': [
              'error',
              {
                allowPattern: '',
                ignoreCase: true
              }
            ],
            'markdown/no-multiple-h1': 'error',
            'markdown/no-reference-like-urls': 'error',
            'markdown/no-reversed-media-syntax': 'error',
            'markdown/no-space-in-emphasis': [
              'error',
              {
                checkStrikethrough: true
              }
            ],
            'markdown/no-unused-definitions': [
              'error',
              {
                allowDefinitions: [],
                allowFootnoteDefinitions: []
              }
            ],
            'markdown/require-alt-text': 'error',
            'markdown/table-column-count': [
              'error',
              {
                checkMissingCells: true
              }
            ]
          }
        }
      ]),

  {
    ignores: ['.cache/', '.temp/', '_reports/', 'node_modules/', 'index.js']
  }
];
