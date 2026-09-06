// SPDX-License-Identifier: ISC

import * as plugin from '../index';

export const configRecommended = {
  plugins: {top: plugin},
  rules: {
    'top/no-top-level-side-effects': [
      'error',
      {
        allowDerived: false,
        allowedCalls: ['Symbol'],
        allowedNews: ['Map', 'Set', 'WeakMap', 'WeakSet'],
        allowFunctionProperties: false,
        allowIIFE: false,
        allowPropertyAccess: true
      }
    ],
    'top/no-top-level-state': [
      'error',
      {
        allow: ['ArrayExpression', 'ObjectExpression']
      }
    ],
    'top/no-top-level-variables': [
      'error',
      {
        kind: ['const']
      }
    ]
  }
};
