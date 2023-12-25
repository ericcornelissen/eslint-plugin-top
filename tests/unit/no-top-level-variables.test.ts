// SPDX-License-Identifier: ISC

import * as parser from '@typescript-eslint/parser';
import {RuleTester} from 'eslint';

import {trimTestCases} from './helpers';
import {noTopLevelVariables} from '../../lib/rules/no-top-level-variables';

const valid: RuleTester.ValidTestCase[] = [
  {
    code: `
      function fVar() {
        var foo = 'bar';
      }
      function fLet() {
        let foo = 'bar';
      }
      function fConst() {
        const foo = 'bar';
      }
    `
  },
  {
    code: `
      var path = require('path');
      var foo1 = 'bar';
      export var foo2 = 'bar';
    `,
    options: [
      {
        kind: ['var']
      }
    ]
  },
  {
    code: `
      let path = require('path');
      let foo1 = 'bar';
      export let foo2 = 'bar';
    `,
    options: [
      {
        kind: ['let']
      }
    ]
  },
  {
    code: `
      class ClassName { }
      function functionName() { }
      function* generatorName() { }

      const leet = 1337;
      const leetBig = 1337n;
      const negative = -1;

      const regularExpression = /bar/;

      const str1 = 'bar';
      const str2 = "bar";
      const str3 = \`bar\`;
      const str4 = $\`bar\`;

      const identifier = bar;
      const isArray = Array.isArray;

      const assignment = bar = 1;
      const binary = bar + baz;
      const logical = bar || baz;
      const unary = -bar;
      const update = i++;
      const ternary = bar ? bar : baz;

      const f = function() { };
      const g = () => 'bar';

      const { o1, o2: o3 } = o;
      const [ a1, a2 ] = a;

      const symbol = Symbol();
      const bigInt = BigInt(1);

      const path = require('path');
      const promised = await h();
    `
  },
  {
    code: `
      export class ClassName { }
      export function functionName() { }
      export function* generatorName() { }

      export const leet = 1337;
      export const leetBig = 1337n;
      export const negative = -1;

      export const regularExpression = /bar/;

      export const str1 = 'bar';
      export const str2 = "bar";
      export const str3 = \`bar\`;
      export const str4 = $\`bar\`;

      export const identifier = bar;
      export const isArray = Array.isArray;

      export const assignment = bar = 1;
      export const binary = bar + baz;
      export const logical = bar || baz;
      export const unary = -bar;
      export const update = i++;
      export const ternary = bar ? bar : baz;

      export const f = function() { };
      export const g = () => 'bar';

      export const { o1, o2: o3 } = o;
      export const [ a1, a2 ] = a;

      export const symbol = Symbol();
      export const bigInt = BigInt(1);

      export const promised = await h();

      const name1 = 0, name2 = 0, name3 = 0;
      export { name1, name2 as name2a, name3 as "name 3" };

      export * from "module-name";
      export * as name4 from "module-name";
      export { name5, name6 } from "module-name";
      export { import1 as name7, import2 as name8, name9 } from "module-name";
      export { default as name10, name11 } from "module-name";
    `
  },
  {
    code: `
      const x = 0;
      export { x as default };
    `
  },
  {
    code: `
      export { default } from "module-name";
    `
  },
  {
    code: `
      export default class ClassName { }
    `
  },
  {
    code: `
      export default function f() { }
    `
  },
  {
    code: `
      export default function* g() { }
    `
  },
  {
    code: `
      export default class { }
    `
  },
  {
    code: `
      export default function() { }
    `
  },
  {
    code: `
      export default function* () { }
    `
  },
  {
    code: `
      const foo = ["b", "a", "r"];
    `,
    options: [
      {
        allowed: ['ArrayExpression']
      }
    ]
  },
  {
    code: `
      const foo = { bar: "baz" };
    `,
    options: [
      {
        allowed: ['ObjectExpression']
      }
    ]
  }
];

const invalid: RuleTester.InvalidTestCase[] = [
  {
    code: `
      var foo1 = 'bar';
      let foo2 = 'bar';
      const foo3 = 'bar';
    `,
    options: [
      {
        kind: []
      }
    ],
    errors: [
      {
        messageId: '1',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 18
      },
      {
        messageId: '2',
        line: 2,
        column: 7,
        endLine: 2,
        endColumn: 24
      },
      {
        messageId: '3',
        line: 3,
        column: 7,
        endLine: 3,
        endColumn: 26
      }
    ]
  },
  {
    code: `
      {var foo1 = 'bar';}
      {let foo2 = 'bar';}
      {const foo3 = 'bar';}
    `,
    options: [
      {
        kind: []
      }
    ],
    errors: [
      {
        messageId: '1',
        line: 1,
        column: 2,
        endLine: 1,
        endColumn: 19
      },
      {
        messageId: '2',
        line: 2,
        column: 8,
        endLine: 2,
        endColumn: 25
      },
      {
        messageId: '3',
        line: 3,
        column: 8,
        endLine: 3,
        endColumn: 27
      }
    ]
  },
  {
    code: `
      export var foo1 = 'bar';
      export let foo2 = 'bar';
      export const foo3 = 'bar';
    `,
    options: [
      {
        kind: []
      }
    ],
    errors: [
      {
        messageId: '1',
        line: 1,
        column: 8,
        endLine: 1,
        endColumn: 25
      },
      {
        messageId: '2',
        line: 2,
        column: 14,
        endLine: 2,
        endColumn: 31
      },
      {
        messageId: '3',
        line: 3,
        column: 14,
        endLine: 3,
        endColumn: 33
      }
    ]
  },
  {
    code: `
      export var name1, name2;
      export let name3, name4;
    `,
    errors: [
      {
        messageId: '1',
        line: 1,
        column: 8,
        endLine: 1,
        endColumn: 25
      },
      {
        messageId: '2',
        line: 2,
        column: 14,
        endLine: 2,
        endColumn: 31
      }
    ]
  },
  {
    code: `
      var foo1 = 'bar', hello1 = 'world';
      let foo2 = 'bar', hello2 = 'world';
      const foo3 = 'bar', hello3 = 'world';
    `,
    options: [
      {
        kind: []
      }
    ],
    errors: [
      {
        messageId: '1',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 36
      },
      {
        messageId: '2',
        line: 2,
        column: 7,
        endLine: 2,
        endColumn: 42
      },
      {
        messageId: '3',
        line: 3,
        column: 7,
        endLine: 3,
        endColumn: 44
      }
    ]
  },
  {
    code: `
      const foo = {bar: "baz"};
    `,
    errors: [
      {
        messageId: '0',
        line: 1,
        column: 7,
        endLine: 1,
        endColumn: 25
      }
    ]
  },
  {
    code: `
      const foo = {bar: "baz"}, hello = {world: "!"};
    `,
    errors: [
      {
        messageId: '0',
        line: 1,
        column: 7,
        endLine: 1,
        endColumn: 25
      },
      {
        messageId: '0',
        line: 1,
        column: 27,
        endLine: 1,
        endColumn: 47
      }
    ]
  },
  {
    code: `
      const path = require('path'), foo1 = {};
      const foo2 = {}, fs = require('fs');
    `,
    errors: [
      {
        messageId: '0',
        line: 1,
        column: 31,
        endLine: 1,
        endColumn: 40
      },
      {
        messageId: '0',
        line: 2,
        column: 13,
        endLine: 2,
        endColumn: 22
      }
    ]
  },
  {
    code: `
      const arr = [];
      const foo = ["b", "a", "r"];
    `,
    options: [
      {
        allowed: ['ObjectExpression']
      }
    ],
    errors: [
      {
        messageId: '0',
        line: 1,
        column: 7,
        endLine: 1,
        endColumn: 15
      },
      {
        messageId: '0',
        line: 2,
        column: 13,
        endLine: 2,
        endColumn: 34
      }
    ]
  },
  {
    code: `
      const obj = {};
      const foo = { bar: "baz" };
    `,
    options: [
      {
        allowed: ['ArrayExpression']
      }
    ],
    errors: [
      {
        messageId: '0',
        line: 1,
        column: 7,
        endLine: 1,
        endColumn: 15
      },
      {
        messageId: '0',
        line: 2,
        column: 13,
        endLine: 2,
        endColumn: 33
      }
    ]
  }
];

new RuleTester({
  parser,
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    env: {
      es6: true
    }
  }
}).run('no-top-level-variables', noTopLevelVariables, {
  valid: valid.map(trimTestCases),
  invalid: invalid.map(trimTestCases)
});
