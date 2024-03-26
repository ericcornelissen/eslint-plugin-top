// SPDX-License-Identifier: ISC

import * as parser from '@typescript-eslint/parser';
import {RuleTester} from 'eslint';

import {trimTestCases} from './helpers';
import {noTopLevelSideEffects} from '../../lib/rules/no-top-level-side-effects';

const valid: RuleTester.ValidTestCase[] = [
  {
    code: `
      function foobar() {
        if (foo === bar) {
          foo = "bar";
        }

        for (let i = 0; i < 2; i++) {
          foo = bar[i];
        }

        while (foo !== "bar") {
          foo = "bar";
        }

        switch (foo) {
        case "bar":
          return "foo";
        default:
          return "bar";
        }
      }
    `
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

      const identifier = bar;
      const isArray = Array.isArray;

      const f = function() { };
      const g = () => 'bar';

      const { o1, o2: o3 } = o;
      const [ a1, a2 ] = a;
    `
  },
  {
    code: `
      import defaultExport1 from "module-name";
      import * as all1 from "module-name";
      import { export1, export2 } from "module-name";
      import { export3 as alias1, export4 } from "module-name";
      import { default as alias2, export5 } from "module-name";
      import { "string name" as alias3 } from "module-name";
      import defaultExport2, { export6 } from "module-name";
      import defaultExport3, * as all2 from "module-name";
      import "module-name";
    `
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

      const identifier = bar;
      const isArray = Array.isArray;

      const f = function() { };
      const g = () => 'bar';

      const { o1, o2: o3 } = o;
      const [ a1, a2 ] = a;

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
      const symbol1 = Symbol();
      export const symbol2 = Symbol();

      const bigInt1 = BigInt(1);
      export const bigInt2 = BigInt(2);
    `
  },
  {
    code: `
      const symbol1 = Symbol();
      export const symbol2 = Symbol();
    `,
    options: [
      {
        allowedCalls: ['Symbol']
      }
    ]
  },
  {
    code: `
      const bigInt1 = BigInt();
      export const bigInt2 = BigInt();
    `,
    options: [
      {
        allowedCalls: ['BigInt']
      }
    ]
  },
  {
    code: `
      const map = new Map();
      const set = new Set();
    `,
    options: [
      {
        allowedNews: ['Map', 'Set']
      }
    ]
  },
  {
    code: `
      (function() { return ''; })();
      (() => { return ''; })();
    `,
    options: [
      {
        allowIIFE: true
      }
    ]
  },
  {
    code: `
      require('dotenv');
      var fs = require('fs');
      let cp = require('child_process');
      const path = require('path');

      module.exports = {};
      module.exports.foobar = {};
      exports = {};
      exports.foobar = {};
    `,
    options: [
      {
        commonjs: true
      }
    ]
  },
  {
    code: `
      const b01 = a == b;
      const b02 = a != b;
      const b03 = a === b;
      const b04 = a !== b;
      const b05 = a < b;
      const b06 = a <= b;
      const b07 = a > b;
      const b08 = a >= b;
      const b09 = a << b;
      const b10 = a >> b;
      const b11 = a >>> b;
      const b12 = a + b;
      const b13 = a - b;
      const b14 = a * b;
      const b15 = a / b;
      const b16 = a % b;
      const b17 = a ** b;
      const b18 = a | b;
      const b19 = a ^ b;
      const b20 = a & b;
      const b21 = a in b;
      const b22 = a instanceof b;

      const l01 = a && b;
      const l02 = a || b;
      const l03 = a ?? b;

      const u01 = -a;
      const u02 = +a;
      const u03 = !a;
      const u04 = ~a;
    `,
    options: [
      {
        allowDerived: true
      }
    ]
  }
];

const invalid: RuleTester.InvalidTestCase[] = [
  {
    code: `
      do {
        i++;
      } while (i<10);
      for (let i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        s += i;
      }
      for (let i of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        s += i;
      }
      for (let i=0;i<10;i++) {
        s += i;
      }
      if (foo) {
        bar();
      }
      switch (foo) {
      case 'bar':
        break;
      case 'baz':
        break;
      }
      throw new Error('Hello world!');
      try { } catch (e) { }
      try { } catch (e) { } finally { }
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
        endColumn: 22
      },
      {
        messageId: '0',
        line: 4,
        column: 7,
        endLine: 6,
        endColumn: 8
      },
      {
        messageId: '0',
        line: 7,
        column: 7,
        endLine: 9,
        endColumn: 8
      },
      {
        messageId: '0',
        line: 10,
        column: 7,
        endLine: 12,
        endColumn: 8
      },
      {
        messageId: '0',
        line: 13,
        column: 7,
        endLine: 15,
        endColumn: 8
      },
      {
        messageId: '0',
        line: 16,
        column: 7,
        endLine: 21,
        endColumn: 8
      },
      {
        messageId: '0',
        line: 22,
        column: 7,
        endLine: 22,
        endColumn: 39
      },
      {
        messageId: '0',
        line: 23,
        column: 7,
        endLine: 23,
        endColumn: 28
      },
      {
        messageId: '0',
        line: 24,
        column: 7,
        endLine: 24,
        endColumn: 40
      },
      {
        messageId: '0',
        line: 25,
        column: 7,
        endLine: 27,
        endColumn: 8
      }
    ]
  },
  {
    code: `
      (function() { return ''; })();
      (() => '')();

      var v1 = (function() { })();
      let v2 = (function() { })();
      const v3 = (function() { })();
      var v4 = (() => { })();
      let v5 = (() => { })();
      const v6 = (() => { })();

      module.exports = (function() { })();
      module.exports = (() => { })();

      export const v7 = (function() { })();
      export const v8 = (() => { })();
    `,
    options: [
      {
        commonjs: true
      }
    ],
    errors: [
      {
        messageId: '0',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 31
      },
      {
        messageId: '0',
        line: 2,
        column: 7,
        endLine: 2,
        endColumn: 20
      },
      {
        messageId: '0',
        line: 4,
        column: 16,
        endLine: 4,
        endColumn: 34
      },
      {
        messageId: '0',
        line: 5,
        column: 16,
        endLine: 5,
        endColumn: 34
      },
      {
        messageId: '0',
        line: 6,
        column: 18,
        endLine: 6,
        endColumn: 36
      },
      {
        messageId: '0',
        line: 7,
        column: 16,
        endLine: 7,
        endColumn: 29
      },
      {
        messageId: '0',
        line: 8,
        column: 16,
        endLine: 8,
        endColumn: 29
      },
      {
        messageId: '0',
        line: 9,
        column: 18,
        endLine: 9,
        endColumn: 31
      },
      {
        messageId: '0',
        line: 11,
        column: 24,
        endLine: 11,
        endColumn: 42
      },
      {
        messageId: '0',
        line: 12,
        column: 24,
        endLine: 12,
        endColumn: 37
      },
      {
        messageId: '0',
        line: 14,
        column: 25,
        endLine: 14,
        endColumn: 43
      },
      {
        messageId: '0',
        line: 15,
        column: 25,
        endLine: 15,
        endColumn: 38
      }
    ]
  },
  {
    code: `
      var v1 = (function() { })();
      let v2 = (function() { })();
      const v3 = (function() { })();
      var v4 = (() => { })();
      let v5 = (() => { })();
      const v6 = (() => { })();

      module.exports = (function() { })();
      module.exports = (() => { })();

      export const v7 = (function() { })();
      export const v8 = (() => { })();
    `,
    options: [
      {
        allowIIFE: true,
        commonjs: true
      }
    ],
    errors: [
      {
        messageId: '0',
        line: 1,
        column: 10,
        endLine: 1,
        endColumn: 28
      },
      {
        messageId: '0',
        line: 2,
        column: 16,
        endLine: 2,
        endColumn: 34
      },
      {
        messageId: '0',
        line: 3,
        column: 18,
        endLine: 3,
        endColumn: 36
      },
      {
        messageId: '0',
        line: 4,
        column: 16,
        endLine: 4,
        endColumn: 29
      },
      {
        messageId: '0',
        line: 5,
        column: 16,
        endLine: 5,
        endColumn: 29
      },
      {
        messageId: '0',
        line: 6,
        column: 18,
        endLine: 6,
        endColumn: 31
      },
      {
        messageId: '0',
        line: 8,
        column: 24,
        endLine: 8,
        endColumn: 42
      },
      {
        messageId: '0',
        line: 9,
        column: 24,
        endLine: 9,
        endColumn: 37
      },
      {
        messageId: '0',
        line: 11,
        column: 25,
        endLine: 11,
        endColumn: 43
      },
      {
        messageId: '0',
        line: 12,
        column: 25,
        endLine: 12,
        endColumn: 38
      }
    ]
  },
  {
    code: `
      hello_world('hello world');

      module.exports = hello_world('hello world');
      export const hello = hello_world('hello world');
      var foo1 = hello_world('bar1');
      let foo2 = hello_world('bar2');
      const foo3 = hello_world('bar3');
    `,
    options: [
      {
        commonjs: true
      }
    ],
    errors: [
      {
        messageId: '0',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 28
      },
      {
        messageId: '0',
        line: 3,
        column: 24,
        endLine: 3,
        endColumn: 50
      },
      {
        messageId: '0',
        line: 4,
        column: 28,
        endLine: 4,
        endColumn: 54
      },
      {
        messageId: '0',
        line: 5,
        column: 18,
        endLine: 5,
        endColumn: 37
      },
      {
        messageId: '0',
        line: 6,
        column: 18,
        endLine: 6,
        endColumn: 37
      },
      {
        messageId: '0',
        line: 7,
        column: 20,
        endLine: 7,
        endColumn: 39
      }
    ]
  },
  {
    code: `
      console.log('hello world');

      module.exports = console.log('hello world');
      export const hello = console.log('hello world');
      var foo1 = console.log('bar1');
      let foo2 = console.log('bar2');
      const foo3 = console.log('bar3');
    `,
    options: [
      {
        commonjs: true
      }
    ],
    errors: [
      {
        messageId: '0',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 28
      },
      {
        messageId: '0',
        line: 3,
        column: 24,
        endLine: 3,
        endColumn: 50
      },
      {
        messageId: '0',
        line: 4,
        column: 28,
        endLine: 4,
        endColumn: 54
      },
      {
        messageId: '0',
        line: 5,
        column: 18,
        endLine: 5,
        endColumn: 37
      },
      {
        messageId: '0',
        line: 6,
        column: 18,
        endLine: 6,
        endColumn: 37
      },
      {
        messageId: '0',
        line: 7,
        column: 20,
        endLine: 7,
        endColumn: 39
      }
    ]
  },
  {
    code: `
      new HelloWorld();

      module.exports = new HelloWorld();
      export const hello = new HelloWorld();
      var foo1 = new Bar();
      let foo2 = new Bar();
      const foo3 = new Bar();
    `,
    options: [
      {
        allowedNews: ['Map', 'Set'],
        commonjs: true
      }
    ],
    errors: [
      {
        messageId: '0',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 18
      },
      {
        messageId: '0',
        line: 3,
        column: 24,
        endLine: 3,
        endColumn: 40
      },
      {
        messageId: '0',
        line: 4,
        column: 28,
        endLine: 4,
        endColumn: 44
      },
      {
        messageId: '0',
        line: 5,
        column: 18,
        endLine: 5,
        endColumn: 27
      },
      {
        messageId: '0',
        line: 6,
        column: 18,
        endLine: 6,
        endColumn: 27
      },
      {
        messageId: '0',
        line: 7,
        column: 20,
        endLine: 7,
        endColumn: 29
      }
    ]
  },
  {
    code: `
      fetch('/api').then(res=>res.text()).then(console.log);
      await fetch('/api');
      const promised = await fetch('/api');
    `,
    errors: [
      {
        messageId: '0',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 55
      },
      {
        messageId: '0',
        line: 2,
        column: 7,
        endLine: 2,
        endColumn: 27
      },
      {
        messageId: '0',
        line: 3,
        column: 24,
        endLine: 3,
        endColumn: 43
      }
    ]
  },
  {
    code: `
      console.log('hello world');
    `,
    options: [
      {
        allowIIFE: true
      }
    ],
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
    code: `
      {
        console.log('hello world');
      }
    `,
    errors: [
      {
        messageId: '0',
        line: 2,
        column: 9,
        endLine: 2,
        endColumn: 36
      }
    ]
  },
  {
    code: `
      const symbol1 = Symbol();
      export const symbol2 = Symbol();

      const bigInt1 = BigInt();
      export const bigInt2 = BigInt();
    `,
    options: [
      {
        allowedCalls: []
      }
    ],
    errors: [
      {
        messageId: '0',
        line: 1,
        column: 17,
        endLine: 1,
        endColumn: 25
      },
      {
        messageId: '0',
        line: 2,
        column: 30,
        endLine: 2,
        endColumn: 38
      },
      {
        messageId: '0',
        line: 4,
        column: 23,
        endLine: 4,
        endColumn: 31
      },
      {
        messageId: '0',
        line: 5,
        column: 30,
        endLine: 5,
        endColumn: 38
      }
    ]
  },
  {
    code: `
      const foo = 1 + 2;
    `,
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
    code: `
      const foo = x > 1 ? "a" : "b";
    `,
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
    code: `
      const foo = bar || baz;
    `,
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
    code: `
      const foo = f\`bar\`;
    `,
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
    code: `
      const foo = i++;
    `,
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
    code: `
      const foo = -bar;
    `,
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
    code: `
      const foo = \`\${bar}\`;
    `,
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
    code: `
      const foo = bar?.baz;
    `,
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
    code: `
      module.exports = {};
      module.exports.foobar = {};
      exports = {};
      exports.foobar = {};
    `,
    errors: [
      {
        messageId: '0',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 21
      },
      {
        messageId: '0',
        line: 2,
        column: 7,
        endLine: 2,
        endColumn: 34
      },
      {
        messageId: '0',
        line: 3,
        column: 7,
        endLine: 3,
        endColumn: 20
      },
      {
        messageId: '0',
        line: 4,
        column: 7,
        endLine: 4,
        endColumn: 27
      }
    ]
  },
  {
    code: `
      require('dotenv');
      var fs = require('fs');
      let cp = require('child_process');
      const path = require('path');

      module.exports = {};
      module.exports.foobar = {};
      exports = {};
      exports.foobar = {};
    `,
    options: [
      {
        commonjs: false
      }
    ],
    errors: [
      {
        messageId: '0',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 19
      },
      {
        messageId: '0',
        line: 2,
        column: 16,
        endLine: 2,
        endColumn: 29
      },
      {
        messageId: '0',
        line: 3,
        column: 16,
        endLine: 3,
        endColumn: 40
      },
      {
        messageId: '0',
        line: 4,
        column: 20,
        endLine: 4,
        endColumn: 35
      },
      {
        messageId: '0',
        line: 6,
        column: 7,
        endLine: 6,
        endColumn: 27
      },
      {
        messageId: '0',
        line: 7,
        column: 7,
        endLine: 7,
        endColumn: 34
      },
      {
        messageId: '0',
        line: 8,
        column: 7,
        endLine: 8,
        endColumn: 20
      },
      {
        messageId: '0',
        line: 9,
        column: 7,
        endLine: 9,
        endColumn: 27
      }
    ]
  },
  {
    code: `
      notModule.exports = {};
    `,
    options: [
      {
        commonjs: true
      }
    ],
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
    code: `
      notExports = {};
    `,
    options: [
      {
        commonjs: true
      }
    ],
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
    code: `
      notExports.foobar = {};
    `,
    options: [
      {
        commonjs: true
      }
    ],
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
    code: `
      notModule.exports.foobar = {};
    `,
    options: [
      {
        commonjs: true
      }
    ],
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
    code: `
      module.notExports.foobar = {};
    `,
    options: [
      {
        commonjs: true
      }
    ],
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
    code: `
      const b01 = a == b;
      const b02 = a != b;
      const b03 = a === b;
      const b04 = a !== b;
      const b05 = a < b;
      const b06 = a <= b;
      const b07 = a > b;
      const b08 = a >= b;
      const b09 = a << b;
      const b10 = a >> b;
      const b11 = a >>> b;
      const b12 = a + b;
      const b13 = a - b;
      const b14 = a * b;
      const b15 = a / b;
      const b16 = a % b;
      const b17 = a ** b;
      const b18 = a | b;
      const b19 = a ^ b;
      const b20 = a & b;
      const b21 = a in b;
      const b22 = a instanceof b;

      const l01 = a && b;
      const l02 = a || b;
      const l03 = a ?? b;

      const u01 = -a;
      const u02 = +a;
      const u03 = !a;
      const u04 = ~a;
    `,
    errors: [
      {
        messageId: '0',
        line: 1,
        column: 13,
        endLine: 1,
        endColumn: 19
      },
      {
        messageId: '0',
        line: 2,
        column: 19,
        endLine: 2,
        endColumn: 25
      },
      {
        messageId: '0',
        line: 3,
        column: 19,
        endLine: 3,
        endColumn: 26
      },
      {
        messageId: '0',
        line: 4,
        column: 19,
        endLine: 4,
        endColumn: 26
      },
      {
        messageId: '0',
        line: 5,
        column: 19,
        endLine: 5,
        endColumn: 24
      },
      {
        messageId: '0',
        line: 6,
        column: 19,
        endLine: 6,
        endColumn: 25
      },
      {
        messageId: '0',
        line: 7,
        column: 19,
        endLine: 7,
        endColumn: 24
      },
      {
        messageId: '0',
        line: 8,
        column: 19,
        endLine: 8,
        endColumn: 25
      },
      {
        messageId: '0',
        line: 9,
        column: 19,
        endLine: 9,
        endColumn: 25
      },
      {
        messageId: '0',
        line: 10,
        column: 19,
        endLine: 10,
        endColumn: 25
      },
      {
        messageId: '0',
        line: 11,
        column: 19,
        endLine: 11,
        endColumn: 26
      },
      {
        messageId: '0',
        line: 12,
        column: 19,
        endLine: 12,
        endColumn: 24
      },
      {
        messageId: '0',
        line: 13,
        column: 19,
        endLine: 13,
        endColumn: 24
      },
      {
        messageId: '0',
        line: 14,
        column: 19,
        endLine: 14,
        endColumn: 24
      },
      {
        messageId: '0',
        line: 15,
        column: 19,
        endLine: 15,
        endColumn: 24
      },
      {
        messageId: '0',
        line: 16,
        column: 19,
        endLine: 16,
        endColumn: 24
      },
      {
        messageId: '0',
        line: 17,
        column: 19,
        endLine: 17,
        endColumn: 25
      },
      {
        messageId: '0',
        line: 18,
        column: 19,
        endLine: 18,
        endColumn: 24
      },
      {
        messageId: '0',
        line: 19,
        column: 19,
        endLine: 19,
        endColumn: 24
      },
      {
        messageId: '0',
        line: 20,
        column: 19,
        endLine: 20,
        endColumn: 24
      },
      {
        messageId: '0',
        line: 21,
        column: 19,
        endLine: 21,
        endColumn: 25
      },
      {
        messageId: '0',
        line: 22,
        column: 19,
        endLine: 22,
        endColumn: 33
      },
      {
        messageId: '0',
        line: 24,
        column: 19,
        endLine: 24,
        endColumn: 25
      },
      {
        messageId: '0',
        line: 25,
        column: 19,
        endLine: 25,
        endColumn: 25
      },
      {
        messageId: '0',
        line: 26,
        column: 19,
        endLine: 26,
        endColumn: 25
      },

      {
        messageId: '0',
        line: 28,
        column: 19,
        endLine: 28,
        endColumn: 21
      },
      {
        messageId: '0',
        line: 29,
        column: 19,
        endLine: 29,
        endColumn: 21
      },
      {
        messageId: '0',
        line: 30,
        column: 19,
        endLine: 30,
        endColumn: 21
      },
      {
        messageId: '0',
        line: 31,
        column: 19,
        endLine: 31,
        endColumn: 21
      }
    ]
  },
  {
    code: `
      const bLeft = f() + b;
      const bRight = a - g();
      const bBoth = f() * g();

      const lLeft = f() && b;
      const lRight = a || g();
      const lBoth = f() ?? g();

      const u = -f();
    `,
    options: [
      {
        allowDerived: true
      }
    ],
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
        line: 2,
        column: 26,
        endLine: 2,
        endColumn: 29
      },
      {
        messageId: '0',
        line: 3,
        column: 21,
        endLine: 3,
        endColumn: 24
      },
      {
        messageId: '0',
        line: 3,
        column: 27,
        endLine: 3,
        endColumn: 30
      },
      {
        messageId: '0',
        line: 5,
        column: 21,
        endLine: 5,
        endColumn: 24
      },
      {
        messageId: '0',
        line: 6,
        column: 27,
        endLine: 6,
        endColumn: 30
      },
      {
        messageId: '0',
        line: 7,
        column: 21,
        endLine: 7,
        endColumn: 24
      },
      {
        messageId: '0',
        line: 7,
        column: 28,
        endLine: 7,
        endColumn: 31
      },
      {
        messageId: '0',
        line: 9,
        column: 18,
        endLine: 9,
        endColumn: 21
      }
    ]
  }
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
