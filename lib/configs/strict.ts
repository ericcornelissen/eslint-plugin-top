// SPDX-License-Identifier: ISC

import * as plugin from '../index';

export const configStrict = {
  plugins: {top: plugin},
  rules: {
    'top/no-top-level-side-effects': [
      'error',
      {
        allowedCalls: [],
        allowedNews: [],
        allowIIFE: false,
        allowDerived: false,
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
