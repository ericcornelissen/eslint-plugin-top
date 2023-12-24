// SPDX-License-Identifier: ISC

import * as parser from '@typescript-eslint/parser';
import {RuleTester} from 'eslint';

import {trimTestCases} from './helpers';
import {noTopLevelVariables} from '../../lib/rules/no-top-level-variables';

const valid: RuleTester.ValidTestCase[] = [
  {
    code: `
      export default function () {
        var foo = 'bar';
      }
    `
  },
  {
    code: `
      export default function () {
        let foo = 'bar';
      }
    `
  },
  {
    code: `
      export default function () {
        const foo = 'bar';
      }
    `
  },
  {
    code: `
      const path = require('path');
    `
  },
  {
    code: `
      const foo = 'bar';
      export default function () {}
    `,
    options: [
      {
        kind: ['var']
      }
    ]
  },
  {
    code: `
      const bar = 1337;
    `
  },
  {
    code: `
      const path = require('path'), foo = 'bar';
    `
  },
  {
    code: `
      const isArray = Array.isArray;
    `
  },
  {
    code: `
      const pi = 3.14;
    `,
    options: [
      {
        constAllowed: ['Literal']
      }
    ]
  },
  {
    code: `
      const isArray = Array.isArray;
    `,
    options: [
      {
        constAllowed: ['MemberExpression']
      }
    ]
  },
  {
    code: `
      const foo = () => 'bar';
    `
  },
  {
    code: `
      const foo = () => 'bar';
    `,
    options: [
      {
        constAllowed: ['ArrowFunctionExpression']
      }
    ]
  },
  {
    code: `
      export const bar = 1337;
    `
  },
  {
    code: `
      var bar = 1337;
    `,
    options: [
      {
        kind: ['let', 'const']
      }
    ]
  },
  {
    code: `
      export class ClassName { }
      export function functionName() { }
      export function* generatorName() { }
    `
  }
];

const invalid: RuleTester.InvalidTestCase[] = [
  {
    code: `
      var foo = 'bar';
      export default function () {}
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 5,
        endLine: 1,
        endColumn: 16
      }
    ]
  },
  {
    code: `
      let foo = 'bar';
      export default function () {}
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 5,
        endLine: 1,
        endColumn: 16
      }
    ]
  },
  {
    code: `
      var foobar = 'bar';
      const foo = 'bar';
      export default function () {}
    `,
    options: [
      {
        kind: ['var']
      }
    ],
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 5,
        endLine: 1,
        endColumn: 19
      }
    ]
  },
  {
    code: `
      var foo;
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 5,
        endLine: 1,
        endColumn: 8
      }
    ]
  },
  {
    code: `
      var foo = 'bar', hello = 'world';
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 5,
        endLine: 1,
        endColumn: 16
      },
      {
        messageId: 'message',
        line: 1,
        column: 18,
        endLine: 1,
        endColumn: 33
      }
    ]
  },
  {
    code: `
      let foo = 'bar', hello = 'world';
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 5,
        endLine: 1,
        endColumn: 16
      },
      {
        messageId: 'message',
        line: 1,
        column: 18,
        endLine: 1,
        endColumn: 33
      }
    ]
  },
  {
    code: `
      const foo = 'bar', hello = world();
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 20,
        endLine: 1,
        endColumn: 35
      }
    ]
  },
  {
    code: `
      var path = require('path'), foo = 'bar';
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 29,
        endLine: 1,
        endColumn: 40
      }
    ]
  },
  {
    code: `
      let path = require('path'), foo = 'bar';
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 29,
        endLine: 1,
        endColumn: 40
      }
    ]
  },
  {
    code: `
      const path = require('path'), foo = bar();
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 31,
        endLine: 1,
        endColumn: 42
      }
    ]
  },
  {
    code: `
      const foo = 'bar';
    `,
    options: [
      {
        constAllowed: []
      }
    ],
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 7,
        endLine: 1,
        endColumn: 18
      }
    ]
  },
  {
    code: `
      var isArray = Array.isArray;
    `,
    options: [],
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 5,
        endLine: 1,
        endColumn: 28
      }
    ]
  },
  {
    code: `
      let isArray = Array.isArray;
    `,
    options: [],
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 5,
        endLine: 1,
        endColumn: 28
      }
    ]
  },
  {
    code: `
      const isArray = Array.isArray;
    `,
    options: [
      {
        constAllowed: []
      }
    ],
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 7,
        endLine: 1,
        endColumn: 30
      }
    ]
  },
  {
    code: `
      {
        let foo = 'bar';
      }
    `,
    options: [],
    errors: [
      {
        messageId: 'message',
        line: 2,
        column: 13,
        endLine: 2,
        endColumn: 24
      }
    ]
  },
  {
    code: `
      const foo = new Bar();
    `,
    options: [],
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 7,
        endLine: 1,
        endColumn: 22
      }
    ]
  },
  {
    code: `
      const isArray = Array.isArray;
    `,
    options: [
      {
        constAllowed: ['ArrowFunctionExpression']
      }
    ],
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 7,
        endLine: 1,
        endColumn: 30
      }
    ]
  },
  {
    code: `
      const isArray = Array.isArray;
    `,
    options: [
      {
        constAllowed: ['Literal']
      }
    ],
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 7,
        endLine: 1,
        endColumn: 30
      }
    ]
  },
  {
    code: `
      const pi = 3.14;
    `,
    options: [
      {
        constAllowed: ['ArrowFunctionExpression']
      }
    ],
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 7,
        endLine: 1,
        endColumn: 16
      }
    ]
  },
  {
    code: `
      const pi = 3.14;
    `,
    options: [
      {
        constAllowed: ['MemberExpression']
      }
    ],
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 7,
        endLine: 1,
        endColumn: 16
      }
    ]
  },
  {
    code: `
      var foo = bar();
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 5,
        endLine: 1,
        endColumn: 16
      }
    ]
  },
  {
    code: `
      var foo = () => 'bar';
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 5,
        endLine: 1,
        endColumn: 22
      }
    ]
  },
  {
    code: `
      let foo = () => 'bar';
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 5,
        endLine: 1,
        endColumn: 22
      }
    ]
  },
  {
    code: `
      const foo = () => 'bar';
    `,
    options: [
      {
        constAllowed: ['Literal']
      }
    ],
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 7,
        endLine: 1,
        endColumn: 24
      }
    ]
  },
  {
    code: `
      const foo = () => 'bar';
    `,
    options: [
      {
        constAllowed: ['MemberExpression']
      }
    ],
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 7,
        endLine: 1,
        endColumn: 24
      }
    ]
  },
  {
    code: `
      export var foo = "bar";
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 12,
        endLine: 1,
        endColumn: 23
      }
    ]
  },
  {
    code: `
      export let bar = 1337;
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 12,
        endLine: 1,
        endColumn: 22
      }
    ]
  },
  {
    code: `
      export const foo = () => "bar";
    `,
    options: [
      {
        constAllowed: ['Literal']
      }
    ],
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 14,
        endLine: 1,
        endColumn: 31
      }
    ]
  },
  {
    code: `
      export var name1, name2;
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 12,
        endLine: 1,
        endColumn: 17
      },
      {
        messageId: 'message',
        line: 1,
        column: 19,
        endLine: 1,
        endColumn: 24
      }
    ]
  },
  {
    code: `
      export let name1, name2;
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 12,
        endLine: 1,
        endColumn: 17
      },
      {
        messageId: 'message',
        line: 1,
        column: 19,
        endLine: 1,
        endColumn: 24
      }
    ]
  }
];

new RuleTester({
  parser,
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    env: {
      es6: true
    }
  }
}).run('no-top-level-variables', noTopLevelVariables, {
  valid: valid.map(trimTestCases),
  invalid: invalid.map(trimTestCases)
});
