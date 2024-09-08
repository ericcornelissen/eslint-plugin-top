// SPDX-License-Identifier: ISC

import * as plugin from '../index';

export const configRecommended = {
  plugins: {top: plugin},
  rules: {
    'top/no-top-level-side-effects': [
      'error',
      {
        allowedCalls: ['Symbol'],
        allowedNews: ['Map', 'Set'],
        allowIIFE: false,
        allowDerived: false
      }
    ],
    'top/no-top-level-variables': [
      'error',
      {
        allowed: ['ArrayExpression', 'ObjectExpression'],
        kind: ['const']
      }
    ]
  }
};
