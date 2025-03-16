// SPDX-License-Identifier: ISC

import * as plugin from '../index';

export const configStrict = {
  plugins: {top: plugin},
  rules: {
    'top/no-top-level-side-effects': [
      'error',
      {
        allowDerived: false,
        allowedCalls: [],
        allowedNews: [],
        allowFunctionProperties: false,
        allowIIFE: false,
        allowPropertyAccess: false
      }
    ],
    'top/no-top-level-variables': [
      'error',
      {
        allowed: [],
        kind: ['const']
      }
    ]
  }
};
