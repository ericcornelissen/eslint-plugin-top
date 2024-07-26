// SPDX-License-Identifier: ISC

import type {Linter} from 'eslint';

import * as parser from '@typescript-eslint/parser';
import {RuleTester} from 'eslint';

import {trimTestCases} from './helpers';
import {noTopLevelSideEffects} from '../../lib/rules/no-top-level-side-effects';

const options: {
  [key: string]: {
    allowDerived?: boolean;
    allowedCalls?: string[];
    allowedNews?: string[];
    allowIIFE?: boolean;
    commonjs?: boolean;
  };
} = {
  allowDerived: {
    allowDerived: true
  },
  allowCallSymbol: {
    allowedCalls: ['Symbol']
  },
  allowCallBigInt: {
    allowedCalls: ['BigInt']
  },
  allowNoCalls: {
    allowedCalls: []
  },
  allowNewMapAndSet: {
    allowedNews: ['Map', 'Set']
  },
  allowIIFE: {
    allowIIFE: true
  },
  commonjs: {
    commonjs: true
  },
  noCommonjs: {
    commonjs: false
  }
};

const parserOptions: {
  [key: string]: Linter.ParserOptions;
} = {
  sourceTypeModule: {
    sourceType: 'module'
  },
  sourceTypeScript: {
    sourceType: 'script'
  }
};

const valid: RuleTester.ValidTestCase[] = [
  ...[
    {
      code: `
        function foobar() {
          do {
            i++;
          } while (i<10);
        }
      `
    },
    {
      code: `
        function foobar() {
          for (let i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
            s += i;
          }
        }
      `
    },
    {
      code: `
        function foobar() {
          for (let i of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
            s += i;
          }
        }
      `
    },
    {
      code: `
        function foobar() {
          for (let i=0;i<10;i++) {
            s += i;
          }
        }
      `
    },
    {
      code: `
        function foobar() {
          if (foo) {
            bar();
          }
        }
      `
    },
    {
      code: `
        function foobar() {
          switch (foo) {
          case 'bar':
            break;
          case 'baz':
            break;
          }
        }
      `
    },
    {
      code: `
        function foobar() {
          throw new Error('Hello world!');
        }
      `
    },
    {
      code: `
        function foobar() {
          try { } catch (e) { }
        }
      `
    },
    {
      code: `
        function foobar() {
          try { } catch (e) { } finally { }
        }
      `
    },
    {
      code: `
        function foobar() {
          while (i<10) {
            i++;
          }
        }
      `
    },
    {
      code: `
        function foobar() {
          const binaryExpression0 = 1 + 2;
          const logicalExpression0 = true || false;
          const string0 = 'foobar';
          const string1 = "foobar";
          const string2 = \`foobar\`;
          const string3 = \`foo\${bar}\`;
          const unaryExpression0 = -1;
          const unaryExpression1 = -binaryExpression;
        }
      `
    },
    {
      code: `
        "use strict";

        function foobar() {
          // Nothing to do
        }
      `
    },
    {
      code: `
        'use strict';

        function foobar() {
          // Nothing to do
        }
      `
    },
    {
      code: `
        "foobar";

        function foobar() {
          // Nothing to do
        }
      `
    },
    {
      code: `
        42;

        function foobar() {
          // Nothing to do
        }
      `
    }
  ],
  ...[
    {
      code: `class ClassName { }`
    },
    {
      code: `function functionName() { }`
    },
    {
      code: `function* generatorName() { }`
    },
    {
      code: `const leet = 1337;`
    },
    {
      code: `const leetBig = 1337n;`
    },
    {
      code: `const negative = -1;`
    },
    {
      code: `const regularExpression = /bar/;`
    },
    {
      code: `const str1 = 'bar';`
    },
    {
      code: `const str2 = "bar";`
    },
    {
      code: `const str3 = \`bar\`;`
    },
    {
      code: `const identifier = bar;`
    },
    {
      code: `const isArray = Array.isArray;`
    },
    {
      code: `const f = function() { };`
    },
    {
      code: `const g = () => 'bar';`
    },
    {
      code: `const { o1, o2: o3 } = o;`
    },
    {
      code: `const [ a1, a2 ] = a;`
    }
  ],
  ...[
    {
      code: `import defaultExport1 from "module-name";`
    },
    {
      code: `import * as all1 from "module-name";`
    },
    {
      code: `import { export1, export2 } from "module-name";`
    },
    {
      code: `import { export3 as alias1, export4 } from "module-name";`
    },
    {
      code: `import { default as alias2, export5 } from "module-name";`
    },
    {
      code: `import { "string name" as alias3 } from "module-name";`
    },
    {
      code: `import defaultExport2, { export6 } from "module-name";`
    },
    {
      code: `import defaultExport3, * as all2 from "module-name";`
    },
    {
      code: `import "module-name";`
    }
  ],
  ...[
    {
      code: `class ClassName { }`
    },
    {
      code: `function functionName() { }`
    },
    {
      code: `function* generatorName() { }`
    },
    {
      code: `const leet = 1337;`
    },
    {
      code: `const leetBig = 1337n;`
    },
    {
      code: `const negative = -1;`
    },
    {
      code: `const regularExpression = /bar/;`
    },
    {
      code: `const str1 = 'bar';`
    },
    {
      code: `const str2 = "bar";`
    },
    {
      code: `const str3 = \`bar\`;`
    },
    {
      code: `const identifier = bar;`
    },
    {
      code: `const isArray = Array.isArray;`
    },
    {
      code: `const f = function() { };`
    },
    {
      code: `const g = () => 'bar';`
    },
    {
      code: `const { o1, o2: o3 } = o;`
    },
    {
      code: `const [ a1, a2 ] = a;`
    },
    {
      code: `
        const name1 = 0, name2 = 0, name3 = 0;
        export { name1, name2 as name2a, name3 as "name 3" };
      `
    },
    {
      code: `export * from "module-name";`
    },
    {
      code: `export * as name4 from "module-name";`
    },
    {
      code: `export { name1, name2 } from "module-name";`
    },
    {
      code: `export { import1 as name1, import2 as name2, name3 } from "module-name";`
    },
    {
      code: `export { default as name1, name2 } from "module-name";`
    }
  ],
  ...[
    {
      code: `
        const x = 0;
        export { x as default };
      `
    },
    {
      code: `export { default } from "module-name";`
    },
    {
      code: `export default class ClassName { }`
    },
    {
      code: `export default function f() { }`
    },
    {
      code: `export default function* g() { }`
    },
    {
      code: `export default class { }`
    },
    {
      code: `export default function() { }`
    },
    {
      code: `export default function* () { }`
    }
  ],
  ...[
    {
      code: `const symbol = Symbol();`
    },
    {
      code: `export const symbol = Symbol();`
    }
  ],
  ...[
    {
      code: `const symbol = Symbol();`,
      options: [options.allowCallSymbol]
    },
    {
      code: `export const symbol = Symbol();`,
      options: [options.allowCallSymbol]
    }
  ],
  ...[
    {
      code: `const bigInt = BigInt();`,
      options: [options.allowCallBigInt]
    },
    {
      code: `export const bigInt = BigInt();`,
      options: [options.allowCallBigInt]
    }
  ],
  ...[
    {
      code: `const map = new Map();`,
      options: [options.allowNewMapAndSet]
    },
    {
      code: `const set = new Set();`,
      options: [options.allowNewMapAndSet]
    }
  ],
  ...[
    {
      code: `(function() { return ''; })();`,
      options: [options.allowIIFE]
    },
    {
      code: `(() => { return ''; })();`,
      options: [options.allowIIFE]
    }
  ],
  ...[
    {
      code: `require('dotenv');`,
      options: [options.commonjs]
    },
    {
      code: `var fs = require('fs');`,
      options: [options.commonjs]
    },
    {
      code: `let cp = require('child_process');`,
      options: [options.commonjs]
    },
    {
      code: `const path = require('path');`,
      options: [options.commonjs]
    },
    {
      code: `module.exports = {};`,
      options: [options.commonjs]
    },
    {
      code: `module.exports.foobar = {};`,
      options: [options.commonjs]
    },
    {
      code: `exports = {};`,
      options: [options.commonjs]
    },
    {
      code: `exports.foobar = {};`,
      options: [options.commonjs]
    }
  ],
  ...[
    {
      code: `require('dotenv'); // non-module autodetect`,
      parserOptions: parserOptions.sourceTypeScript
    },
    {
      code: `var fs = require('fs');`,
      parserOptions: parserOptions.sourceTypeScript
    },
    {
      code: `let cp = require('child_process');`,
      parserOptions: parserOptions.sourceTypeScript
    },
    {
      code: `const path = require('path');`,
      parserOptions: parserOptions.sourceTypeScript
    },
    {
      code: `module.exports = {};`,
      parserOptions: parserOptions.sourceTypeScript
    },
    {
      code: `module.exports.foobar = {};`,
      parserOptions: parserOptions.sourceTypeScript
    },
    {
      code: `exports = {};`,
      parserOptions: parserOptions.sourceTypeScript
    },
    {
      code: `exports.foobar = {};`,
      parserOptions: parserOptions.sourceTypeScript
    }
  ],
  ...[
    {
      code: `require('dotenv'); // module autodetect w/ commonjs: true`,
      options: [options.commonjs],
      parserOptions: parserOptions.sourceTypeModule
    },
    {
      code: `var fs = require('fs');`,
      options: [options.commonjs],
      parserOptions: parserOptions.sourceTypeModule
    },
    {
      code: `let cp = require('child_process');`,
      options: [options.commonjs],
      parserOptions: parserOptions.sourceTypeModule
    },
    {
      code: `const path = require('path');`,
      options: [options.commonjs],
      parserOptions: parserOptions.sourceTypeModule
    },
    {
      code: `module.exports = {};`,
      options: [options.commonjs],
      parserOptions: parserOptions.sourceTypeModule
    },
    {
      code: `module.exports.foobar = {};`,
      options: [options.commonjs],
      parserOptions: parserOptions.sourceTypeModule
    },
    {
      code: `exports = {};`,
      options: [options.commonjs],
      parserOptions: parserOptions.sourceTypeModule
    },
    {
      code: `exports.foobar = {};`,
      options: [options.commonjs],
      parserOptions: parserOptions.sourceTypeModule
    }
  ],
  ...[
    {
      code: `const b01 = a == b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b02 = a != b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b03 = a === b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b04 = a !== b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b05 = a < b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b06 = a <= b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b07 = a > b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b08 = a >= b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b09 = a << b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b10 = a >> b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b11 = a >>> b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b12 = a + b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b13 = a - b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b14 = a * b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b15 = a / b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b16 = a % b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b17 = a ** b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b18 = a | b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b19 = a ^ b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b20 = a & b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b21 = a in b;`,
      options: [options.allowDerived]
    },
    {
      code: `const b22 = a instanceof b;`,
      options: [options.allowDerived]
    },
    {
      code: `const l01 = a && b;`,
      options: [options.allowDerived]
    },
    {
      code: `const l02 = a || b;`,
      options: [options.allowDerived]
    },
    {
      code: `const l03 = a ?? b;`,
      options: [options.allowDerived]
    },
    {
      code: `const u01 = -a;`,
      options: [options.allowDerived]
    },
    {
      code: `const u02 = +a;`,
      options: [options.allowDerived]
    },
    {
      code: `const u03 = !a;`,
      options: [options.allowDerived]
    },
    {
      code: `const u04 = ~a;`,
      options: [options.allowDerived]
    }
  ]
];

const invalid: RuleTester.InvalidTestCase[] = [
  ...[
    {
      code: `
        do {
          i++;
        } while (i<10);
      `,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 3,
          endColumn: 24
        }
      ]
    },
    {
      code: `
        for (let i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
          s += i;
        }
      `,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 3,
          endColumn: 10
        }
      ]
    },
    {
      code: `
        for (let i of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
          s += i;
        }
      `,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 3,
          endColumn: 10
        }
      ]
    },
    {
      code: `
        for (let i=0;i<10;i++) {
          s += i;
        }
      `,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 3,
          endColumn: 10
        }
      ]
    },
    {
      code: `
        if (foo) {
          bar();
        }
      `,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 3,
          endColumn: 10
        }
      ]
    },
    {
      code: `
        switch (foo) {
        case 'bar':
          break;
        case 'baz':
          break;
        }
      `,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 6,
          endColumn: 10
        }
      ]
    },
    {
      code: `
        throw new Error('Hello world!');
      `,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 33
        }
      ]
    },
    {
      code: `
        try { } catch (e) { }
      `,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 22
        }
      ]
    },
    {
      code: `
        try { } catch (e) { } finally { }
      `,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      code: `
        while (i<10) {
          i++;
        }
      `,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 3,
          endColumn: 10
        }
      ]
    }
  ],
  ...[
    {
      code: `(function() { return ''; })();`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      code: `(() => '')();`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 13
        }
      ]
    },
    {
      code: `var x = (function() { })();`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 9,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      code: `let x = (function() { })();`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 9,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      code: `const x = (function() { })();`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: `var x = (() => { })();`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 9,
          endLine: 1,
          endColumn: 22
        }
      ]
    },
    {
      code: `let x = (() => { })();`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 9,
          endLine: 1,
          endColumn: 22
        }
      ]
    },
    {
      code: `const x = (() => { })();`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: `module.exports = (function() { })();`,
      options: [options.commonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      code: `module.exports = (() => { })();`,
      options: [options.commonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      code: `export const x = (function() { })();`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      code: `export const x = (() => { })();`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 31
        }
      ]
    }
  ],
  ...[
    {
      code: `var x = (function() { })();`,
      options: [options.allowIIFE],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 9,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      code: `let x = (function() { })();`,
      options: [options.allowIIFE],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 9,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      code: `const x = (function() { })();`,
      options: [options.allowIIFE],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: `var x = (() => { })();`,
      options: [options.allowIIFE],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 9,
          endLine: 1,
          endColumn: 22
        }
      ]
    },
    {
      code: `let x = (() => { })();`,
      options: [options.allowIIFE],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 9,
          endLine: 1,
          endColumn: 22
        }
      ]
    },
    {
      code: `const x = (() => { })();`,
      options: [options.allowIIFE],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: `module.exports = (function() { })();`,
      options: [
        {
          ...options.allowIIFE,
          ...options.commonjs
        }
      ],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      code: `module.exports = (() => { })();`,
      options: [
        {
          ...options.allowIIFE,
          ...options.commonjs
        }
      ],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      code: `export const x = (function() { })();`,
      options: [options.allowIIFE],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      code: `export const x = (() => { })();`,
      options: [options.allowIIFE],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 31
        }
      ]
    }
  ],
  ...[
    {
      code: `hello_world('hello world');`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      code: `module.exports = hello_world('hello world');`,
      options: [options.commonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 44
        }
      ]
    },
    {
      code: `export const hello = hello_world('hello world');`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 48
        }
      ]
    },
    {
      code: `var foo = hello_world('bar');`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: `let foo = hello_world('bar');`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: `const foo = hello_world('bar');`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 31
        }
      ]
    }
  ],
  ...[
    {
      code: `console.log('hello world');`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      code: `module.exports = console.log('hello world');`,
      options: [options.commonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 44
        }
      ]
    },
    {
      code: `export const hello = console.log('hello world');`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 48
        }
      ]
    },
    {
      code: `var foo = console.log('bar');`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: `let foo = console.log('bar');`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: `const foo = console.log('bar');`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 31
        }
      ]
    }
  ],
  ...[
    {
      code: `new HelloWorld();`,
      options: [options.allowNewMapAndSet],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 17
        }
      ]
    },
    {
      code: `module.exports = new HelloWorld();`,
      options: [
        {
          ...options.allowNewMapAndSet,
          ...options.commonjs
        }
      ],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      code: `export const hello = new HelloWorld();`,
      options: [options.allowNewMapAndSet],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 38
        }
      ]
    },
    {
      code: `var foo = new Bar();`,
      options: [options.allowNewMapAndSet],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      code: `let foo = new Bar();`,
      options: [options.allowNewMapAndSet],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      code: `const foo = new Bar();`,
      options: [options.allowNewMapAndSet],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 22
        }
      ]
    }
  ],
  ...[
    {
      code: `fetch('/api').then(res=>res.text()).then(console.log);`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 54
        }
      ]
    },
    {
      code: `await fetch('/api');`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      code: `const promised = await fetch('/api');`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 37
        }
      ]
    }
  ],
  ...[
    {
      code: `console.log('hello world');`,
      options: [options.allowIIFE],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 27
        }
      ]
    }
  ],
  ...[
    {
      code: `{console.log('hello world');}`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 2,
          endLine: 1,
          endColumn: 28
        }
      ]
    }
  ],
  ...[
    {
      code: `const bigInt = BigInt();`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: `export const bigInt = BigInt();`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 31
        }
      ]
    }
  ],
  ...[
    {
      code: `const symbol = Symbol();`,
      options: [options.allowNoCalls],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: `export const symbol = Symbol();`,
      options: [options.allowNoCalls],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      code: `const bigInt = BigInt();`,
      options: [options.allowNoCalls],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: `export const bigInt = BigInt();`,
      options: [options.allowNoCalls],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 23,
          endLine: 1,
          endColumn: 31
        }
      ]
    }
  ],
  ...[
    {
      code: `const foo = 1 + 2;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `const foo = x > 1 ? "a" : "b";`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      code: `const foo = bar || baz;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: `const foo = f\`bar\`;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 19
        }
      ]
    },
    {
      code: `const foo = i++;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 16
        }
      ]
    },
    {
      code: `const foo = -bar;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 17
        }
      ]
    },
    {
      code: `const foo = \`\${bar}\`;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 21
        }
      ]
    },
    {
      code: `const foo = bar?.baz;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 21
        }
      ]
    }
  ],
  ...[
    {
      code: `module.exports = {};`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 21
        }
      ]
    },
    {
      code: `module.exports.foobar = {};`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      code: `exports = {};`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 14
        }
      ]
    },
    {
      code: `exports.foobar = {};`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 21
        }
      ]
    }
  ],
  ...[
    {
      code: `require('dotenv');`,
      options: [options.noCommonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `var fs = require('fs');`,
      options: [options.noCommonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: `let cp = require('child_process');`,
      options: [options.noCommonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      code: `const path = require('path');`,
      options: [options.noCommonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: `module.exports = {};`,
      options: [options.noCommonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 21
        }
      ]
    },
    {
      code: `module.exports.foobar = {};`,
      options: [options.noCommonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      code: `exports = {};`,
      options: [options.noCommonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 14
        }
      ]
    },
    {
      code: `exports.foobar = {};`,
      options: [options.noCommonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 21
        }
      ]
    }
  ],
  ...[
    {
      code: `require('dotenv'); // module autodetect`,
      parserOptions: parserOptions.sourceTypeModule,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `var fs = require('fs');`,
      parserOptions: parserOptions.sourceTypeModule,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: `let cp = require('child_process');`,
      parserOptions: parserOptions.sourceTypeModule,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      code: `const path = require('path');`,
      parserOptions: parserOptions.sourceTypeModule,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: `module.exports = {};`,
      parserOptions: parserOptions.sourceTypeModule,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 21
        }
      ]
    },
    {
      code: `module.exports.foobar = {};`,
      parserOptions: parserOptions.sourceTypeModule,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      code: `exports = {};`,
      parserOptions: parserOptions.sourceTypeModule,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 14
        }
      ]
    },
    {
      code: `exports.foobar = {};`,
      parserOptions: parserOptions.sourceTypeModule,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 21
        }
      ]
    }
  ],
  ...[
    {
      code: `require('dotenv'); // non-module autodetect w/ commonjs: false`,
      options: [options.noCommonjs],
      parserOptions: parserOptions.sourceTypeScript,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `var fs = require('fs');`,
      options: [options.noCommonjs],
      parserOptions: parserOptions.sourceTypeScript,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: `let cp = require('child_process');`,
      options: [options.noCommonjs],
      parserOptions: parserOptions.sourceTypeScript,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      code: `const path = require('path');`,
      options: [options.noCommonjs],
      parserOptions: parserOptions.sourceTypeScript,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: `module.exports = {};`,
      options: [options.noCommonjs],
      parserOptions: parserOptions.sourceTypeScript,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 21
        }
      ]
    },
    {
      code: `module.exports.foobar = {};`,
      options: [options.noCommonjs],
      parserOptions: parserOptions.sourceTypeScript,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      code: `exports = {};`,
      options: [options.noCommonjs],
      parserOptions: parserOptions.sourceTypeScript,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 14
        }
      ]
    },
    {
      code: `exports.foobar = {};`,
      options: [options.noCommonjs],
      parserOptions: parserOptions.sourceTypeScript,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 21
        }
      ]
    }
  ],
  ...[
    {
      code: `notModule.exports = {};`,
      options: [options.commonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: `notExports = {};`,
      options: [options.commonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 17
        }
      ]
    },
    {
      code: `notExports.foobar = {};`,
      options: [options.commonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: `notModule.exports.foobar = {};`,
      options: [options.commonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      code: `module.notExports.foobar = {};`,
      options: [options.commonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 31
        }
      ]
    }
  ],
  ...[
    {
      code: `const b01 = a == b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 19
        }
      ]
    },
    {
      code: `const b02 = a != b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 19
        }
      ]
    },
    {
      code: `const b03 = a === b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      code: `const b04 = a !== b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      code: `const b05 = a < b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `const b06 = a <= b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 19
        }
      ]
    },
    {
      code: `const b07 = a > b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `const b08 = a >= b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 19
        }
      ]
    },
    {
      code: `const b09 = a << b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 19
        }
      ]
    },
    {
      code: `const b10 = a >> b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 19
        }
      ]
    },
    {
      code: `const b11 = a >>> b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      code: `const b12 = a + b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `const b13 = a - b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `const b14 = a * b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `const b15 = a / b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `const b16 = a % b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `const b17 = a ** b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 19
        }
      ]
    },
    {
      code: `const b18 = a | b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `const b19 = a ^ b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `const b20 = a & b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `const b21 = a in b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 19
        }
      ]
    },
    {
      code: `const b22 = a instanceof b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      code: `const l01 = a && b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 19
        }
      ]
    },
    {
      code: `const l02 = a || b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 19
        }
      ]
    },
    {
      code: `const l03 = a ?? b;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 19
        }
      ]
    },
    {
      code: `const u01 = -a;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 15
        }
      ]
    },
    {
      code: `const u02 = +a;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 15
        }
      ]
    },
    {
      code: `const u03 = !a;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 15
        }
      ]
    },
    {
      code: `const u04 = ~a;`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 15
        }
      ]
    }
  ],
  ...[
    {
      code: `const bLeft = f() + b;`,
      options: [options.allowDerived],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `const bRight = a - g();`,
      options: [options.allowDerived],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: `const bBoth = f() * g();`,
      options: [options.allowDerived],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 18
        },
        {
          messageId: '0',
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: `const lLeft = f() && b;`,
      options: [options.allowDerived],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `const lRight = a || g();`,
      options: [options.allowDerived],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: `const lBoth = f() ?? g();`,
      options: [options.allowDerived],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 18
        },
        {
          messageId: '0',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      code: `const u = -f();`,
      options: [options.allowDerived],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 12,
          endLine: 1,
          endColumn: 15
        }
      ]
    }
  ]
];

new RuleTester({
  parser,
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  }
}).run('no-top-level-side-effects', noTopLevelSideEffects, {
  valid: valid.map(trimTestCases),
  invalid: invalid.map(trimTestCases)
});
