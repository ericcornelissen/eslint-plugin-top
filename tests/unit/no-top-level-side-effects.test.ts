// SPDX-License-Identifier: ISC

import type {Linter} from 'eslint';

import {RuleTester} from 'eslint';

import {trimTestCases} from './helpers';
import {noTopLevelSideEffects} from '../../lib/rules/no-top-level-side-effects';

const options: {
  [key: string]: {
    allowDerived?: boolean;
    allowedCalls?: string[];
    allowedNews?: string[];
    allowFunctionProperties?: boolean;
    allowIIFE?: boolean;
    allowPropertyAccess?: boolean;
    commonjs?: boolean;
  };
} = {
  allowCallSymbol: {
    allowedCalls: ['Symbol']
  },
  allowCallBigInt: {
    allowedCalls: ['BigInt']
  },
  allowDerived: {
    allowDerived: true
  },
  allowFunctionProperties: {
    allowFunctionProperties: true
  },
  allowIIFE: {
    allowIIFE: true
  },
  allowNoCalls: {
    allowedCalls: []
  },
  allowNoNews: {
    allowedNews: []
  },
  commonjs: {
    commonjs: true
  },
  disallowPropertyAccess: {
    allowPropertyAccess: false
  },
  noCommonjs: {
    commonjs: false
  }
};

const languageOptions: {
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
  // Control flow
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
        async function foobar() {
          if (foo) {
            bar();
          } else {
            await baz();
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
    }
  ],

  // Literal expressions
  ...[
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

  // Basic declarations
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
        function f() {
          const s = \`foo\${bar}\`;
        }
      `
    },
    {
      code: `
        function f() {
          const s = $\`foobar\`;
        }
      `
    }
  ],

  // Import declarations
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

  // Export declarations
  ...[
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
    },
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

  // Default function calls
  ...[
    {
      code: `const symbol = Symbol();`
    },
    {
      code: `export const symbol = Symbol();`
    }
  ],

  // Configured function calls
  ...[
    {
      code: `const symbol = Symbol();`,
      options: [options.allowCallSymbol]
    },
    {
      code: `export const symbol = Symbol();`,
      options: [options.allowCallSymbol]
    },
    {
      code: `const bigInt = BigInt();`,
      options: [options.allowCallBigInt]
    },
    {
      code: `export const bigInt = BigInt();`,
      options: [options.allowCallBigInt]
    },
    {
      code: `const symbol = Symbol.for("membership");`,
      options: [{allowedCalls: ['Symbol.for']}]
    },
    {
      code: `const symbol = x.y.z();`,
      options: [{allowedCalls: ['x.y.z']}]
    }
  ],

  // Configured constructors
  ...[
    {
      code: `const map = new Map();`,
      options: [
        {
          allowedNews: ['Map']
        }
      ]
    },
    {
      code: `const set = new Set();`,
      options: [
        {
          allowedNews: ['Set']
        }
      ]
    },
    {
      code: `const map = new WeakMap();`,
      options: [
        {
          allowedNews: ['WeakMap']
        }
      ]
    },
    {
      code: `const map = new WeakSet();`,
      options: [
        {
          allowedNews: ['WeakSet']
        }
      ]
    }
  ],

  // Immediately Invoked Functions Expressions (IIFE)
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

  // Commonjs, explicitly configured
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
      code: `module.exports.foo = bar();`,
      options: [{...options.commonjs, allowedCalls: ['bar']}]
    },
    {
      code: `module.exports.foo = new Bar();`,
      options: [{...options.commonjs, allowedNews: ['Bar']}]
    },
    {
      code: `exports = {};`,
      options: [options.commonjs]
    },
    {
      code: `exports.foobar = {};`,
      options: [options.commonjs]
    },
    {
      code: `exports.foo = bar();`,
      options: [{...options.commonjs, allowedCalls: ['bar']}]
    },
    {
      code: `exports.foo = new Bar();`,
      options: [{...options.commonjs, allowedNews: ['Bar']}]
    }
  ],

  // Commonjs, source type scripts
  ...[
    {
      code: `require('dotenv');`,
      languageOptions: languageOptions.sourceTypeScript
    },
    {
      code: `var fs = require('fs');`,
      languageOptions: languageOptions.sourceTypeScript
    },
    {
      code: `let cp = require('child_process');`,
      languageOptions: languageOptions.sourceTypeScript
    },
    {
      code: `const path = require('path');`,
      languageOptions: languageOptions.sourceTypeScript
    },
    {
      code: `module.exports = {};`,
      languageOptions: languageOptions.sourceTypeScript
    },
    {
      code: `module.exports.foobar = {};`,
      languageOptions: languageOptions.sourceTypeScript
    },
    {
      code: `exports = {};`,
      languageOptions: languageOptions.sourceTypeScript
    },
    {
      code: `exports.foobar = {};`,
      languageOptions: languageOptions.sourceTypeScript
    }
  ],

  // Commonjs, explicitly configured & source type script
  ...[
    {
      code: `require('dotenv');`,
      options: [options.commonjs],
      languageOptions: languageOptions.sourceTypeModule
    },
    {
      code: `var fs = require('fs');`,
      options: [options.commonjs],
      languageOptions: languageOptions.sourceTypeModule
    },
    {
      code: `let cp = require('child_process');`,
      options: [options.commonjs],
      languageOptions: languageOptions.sourceTypeModule
    },
    {
      code: `const path = require('path');`,
      options: [options.commonjs],
      languageOptions: languageOptions.sourceTypeModule
    },
    {
      code: `module.exports = {};`,
      options: [options.commonjs],
      languageOptions: languageOptions.sourceTypeModule
    },
    {
      code: `module.exports.foobar = {};`,
      options: [options.commonjs],
      languageOptions: languageOptions.sourceTypeModule
    },
    {
      code: `exports = {};`,
      options: [options.commonjs],
      languageOptions: languageOptions.sourceTypeModule
    },
    {
      code: `exports.foobar = {};`,
      options: [options.commonjs],
      languageOptions: languageOptions.sourceTypeModule
    }
  ],

  // A function called require
  ...[
    {
      code: `function require() {}`
    },
    {
      code: `function require() {}`,
      options: [options.noCommonjs]
    },
    {
      code: `function f() { function require() {} }`,
      options: [options.commonjs]
    },
    {
      code: `function notRequire() { }`,
      options: [options.commonjs]
    },
    {
      code: `var require = () => { };`
    },
    {
      code: `var require = "foobar";`
    }
  ],

  // Derived values
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
      code: `const b23 = ok() == b;`,
      options: [{...options.allowDerived, allowedCalls: ['ok']}]
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
      code: `const l04 = ok() && b;`,
      options: [{...options.allowDerived, allowedCalls: ['ok']}]
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
    },
    {
      code: `const u05 = -ok();`,
      options: [{...options.allowDerived, allowedCalls: ['ok']}]
    },
    {
      code: `const s01 = "a" + b;`,
      options: [options.allowDerived]
    },
    {
      code: `const s02 = \`a\${b}\`;`,
      options: [options.allowDerived]
    },
    {
      code: `
        function f() {
          const binaryExpression = a + b;
        }
      `
    },
    {
      code: `
        function f() {
          const logicalExpression = a || b;
        }
      `
    },
    {
      code: `
        function f() {
          const conditionalExpression = foo ? bar : baz;
        }
      `
    },
    {
      code: `
        function f() {
          const unaryExpression = -a;
        }
      `
    },
    {
      code: `
        function f() {
          const chainExpression = foo?.bar;
        }
      `
    }
  ],

  // Property access
  ...[
    {
      code: `const foo = bar.baz;`
    },
    {
      code: `const foo = bar[0];`
    },
    {
      code: `const {foo} = bar;`
    },
    {
      code: `const [foo] = bar;`
    },
    {
      code: `
        function foo() {
          return bar.baz;
        }
      `,
      options: [options.disallowPropertyAccess]
    }
  ],

  // Object declarations
  ...[
    {
      code: `const x = {};`
    },
    {
      code: `const x = { foo: 123 };`
    },
    {
      code: `const x = { foo: 123, bar: 'baz' };`
    },
    {
      code: `const x = { foo: () => 123 };`
    },
    {
      code: `const x = { foo: function() { return true; } };`
    },
    {
      code: `const x = { foo: function*() { yield true; } };`
    },
    {
      code: `const x = { foo() { return 123; } };`
    },
    {
      code: `const x = { foo: ok() };`,
      options: [{allowedCalls: ['ok']}]
    },
    {
      code: `const x = { foo: new Foo() };`,
      options: [{allowedNews: ['Foo']}]
    },
    {
      code: `const x = { foo: require('./config') };`,
      options: [options.commonjs]
    },
    {
      code: `const x = { foo: 40 + 2 };`,
      options: [options.allowDerived]
    },
    {
      code: `const x = { ...foo };`,
      options: [options.allowDerived]
    },
    {
      code: `const x = { [foo]: true };`,
      options: [options.allowDerived]
    },
    {
      code: `const x = { ...ok() };`,
      options: [{...options.allowDerived, allowedCalls: ['ok']}]
    },
    {
      code: `const x = { [ok()]: true };`,
      options: [{...options.allowDerived, allowedCalls: ['ok']}]
    },
    {
      code: `const f = () => ({ foo: 3 + 14 });`
    },
    {
      code: `const f = () => ({ foo: bar() });`
    },
    {
      code: `const f = () => ({ ...foo });`
    },
    {
      code: `const f = () => ({ ...bar() });`
    },
    {
      code: `const f = () => ({ [foo]: true });`
    },
    {
      code: `const f = () => ({ [bar()]: true });`
    }
  ],

  // Array declarations
  ...[
    {
      code: `const arr = [];`
    },
    {
      code: `const arr = ["foobar"];`
    },
    {
      code: `const arr = [3, 14, 'pi'];`
    },
    {
      code: `const arr = [[3, 1], [4]];`
    },
    {
      code: `const arr = [{ pi: 3.14 }];`
    },
    {
      code: `const arr = [ok()];`,
      options: [{allowedCalls: ['ok']}]
    },
    {
      code: `const arr = [new Foo()];`,
      options: [{allowedNews: ['Foo']}]
    },
    {
      code: `const arr = [require('foobar')];`,
      options: [options.commonjs]
    },
    {
      code: `
        const arr1 = [3, 1];
        const arr2 = [...arr1, 4];
      `,
      options: [options.allowDerived]
    },
    {
      code: `const arr = [...ok()];`,
      options: [{...options.allowDerived, allowedCalls: ['ok']}]
    }
  ],

  // Function property assignment
  ...[
    {
      code: `
        function SomeReactComponent() {}
        SomeReactComponent.displayName = 'MyComponent';
      `,
      options: [options.allowFunctionProperties]
    },
    {
      code: `
        function SomeReactComponent() {}
        SomeReactComponent[foo] = 'bar';
      `,
      options: [{...options.allowFunctionProperties, ...options.allowDerived}]
    }
  ]
];

const invalid: RuleTester.InvalidTestCase[] = [
  // Control flow
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

  // Basic declarations
  ...[
    {
      code: `
        const taggedTemplateString = $\`foobar\`;
      `,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 39
        }
      ]
    }
  ],

  // Immediately Invoked Functions Expressions (IIFE), when not allowed
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

  // Immediately Invoked Functions Expressions (IIFE), when allowed
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
      code: `const x = await (function() {return new Promise()})();`,
      options: [options.allowIIFE],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 54
        }
      ]
    },
    {
      code: `const x = await (() => new Promise())();`,
      options: [options.allowIIFE],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 40
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
    },
    {
      code: `const foo = (function() {return 3})() + 14;`,
      options: [{...options.allowIIFE, ...options.allowDerived}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 38
        }
      ]
    },
    {
      code: `const foo = 3 + (() => 14)();`,
      options: [{...options.allowIIFE, ...options.allowDerived}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 17,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: `const foo = -(function() {return 42})();`,
      options: [{...options.allowIIFE, ...options.allowDerived}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 40
        }
      ]
    },
    {
      code: `const foo = -(() => 42)();`,
      options: [{...options.allowIIFE, ...options.allowDerived}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      code: `const foo = (function() {return true})() || false;`,
      options: [{...options.allowIIFE, ...options.allowDerived}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 13,
          endLine: 1,
          endColumn: 41
        }
      ]
    },
    {
      code: `const foo = true || (() => false)();`,
      options: [{...options.allowIIFE, ...options.allowDerived}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 36
        }
      ]
    },
    {
      code: `const foo = Symbol((function() {})());`,
      options: [{...options.allowIIFE, ...options.allowCallSymbol}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 37
        }
      ]
    },
    {
      code: `const foo = Symbol((() => {})());`,
      options: [{...options.allowIIFE, ...options.allowCallSymbol}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      code: `const foo = new Map((function() {})());`,
      options: [{...options.allowIIFE, allowedNews: ['Map']}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 38
        }
      ]
    },
    {
      code: `const foo = new Set((() => {})());`,
      options: [{...options.allowIIFE, allowedNews: ['Set']}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 21,
          endLine: 1,
          endColumn: 33
        }
      ]
    },
    {
      code: `const foo = { bar: (function() {})() };`,
      options: [options.allowIIFE],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 37
        }
      ]
    },
    {
      code: `const foo = { bar: (() => {})() };`,
      options: [options.allowIIFE],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      code: `const foo = { [(function() {})()]: "bar" };`,
      options: [{...options.allowIIFE, ...options.allowDerived}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 33
        }
      ]
    },
    {
      code: `const foo = { [(() => {})()]: "bar" };`,
      options: [{...options.allowIIFE, ...options.allowDerived}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      code: `const foo = { ...(function() {})() };`,
      options: [{...options.allowIIFE, ...options.allowDerived}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 35
        }
      ]
    },
    {
      code: `const foo = { ...(() => {})() };`,
      options: [{...options.allowIIFE, ...options.allowDerived}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 30
        }
      ]
    },
    {
      code: `const x = [(function() {})()];`,
      options: [options.allowIIFE],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 12,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: `const x = [(() => {})()];`,
      options: [options.allowIIFE],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 12,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: `const x = [...(function() {})()];`,
      options: [{...options.allowIIFE, ...options.allowDerived}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      code: `const x = [...(() => {})()];`,
      options: [{...options.allowIIFE, ...options.allowDerived}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      code: `console.log('not an IIFE, but still not allowed');`,
      options: [options.allowIIFE],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 50
        }
      ]
    }
  ],

  // Function calls
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
      code: `console.log('hello world');`,
      options: [{allowedCalls: ['console.info']}],
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
      code: `console[log]('hello world');`,
      options: [{allowedCalls: ['console.log']}],
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
    },
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
    },
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
      code: `const x = foo(bar());`,
      options: [{allowedCalls: ['foo']}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      code: `const x = foo(bar());`,
      options: [{allowedCalls: ['bar']}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 21
        }
      ]
    },
    {
      code: `const x = foo(bar());`,
      options: [options.allowNoCalls],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 21
        },
        {
          messageId: '0',
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 20
        }
      ]
    },
    {
      code: `const x = foo(new Bar());`,
      options: [{allowedCalls: ['foo'], allowedNews: []}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: `const x = new Foo(bar());`,
      options: [{allowedCalls: ['bar'], allowedNews: []}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      code: `const x = foo(new Bar());`,
      options: [{...options.allowNoCalls, ...options.allowNoNews}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 25
        },
        {
          messageId: '0',
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 24
        }
      ]
    }
  ],

  // Method calls
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
    },
    {
      code: `const x = new Foo(new Bar());`,
      options: [{allowedNews: ['Foo']}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      code: `const x = new Foo(new Bar());`,
      options: [{allowedNews: ['Bar']}],
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
      code: `const x = new Foo(new Bar());`,
      options: [options.allowNoNews],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 29
        },
        {
          messageId: '0',
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      code: `const x = new Foo(bar());`,
      options: [{allowedCalls: [], allowedNews: ['Foo']}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: `const x = foo(new Bar());`,
      options: [{allowedCalls: [], allowedNews: ['Bar']}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      code: `const x = new Foo(bar());`,
      options: [{...options.allowNoCalls, ...options.allowNoNews}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 11,
          endLine: 1,
          endColumn: 25
        },
        {
          messageId: '0',
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 24
        }
      ]
    }
  ],

  // Constructors
  ...[
    {
      code: `new HelloWorld();`,
      options: [{allowedNews: ['Set', 'Map']}],
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
          ...options.commonjs,
          allowedNews: ['Set', 'Map']
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
      options: [{allowedNews: ['Set', 'Map']}],
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
      options: [{allowedNews: ['Set', 'Map']}],
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
      options: [{allowedNews: ['Set', 'Map']}],
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
      options: [{allowedNews: ['Set', 'Map']}],
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

  // await/Promises
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

  // Block statements
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

  // Commonjs, default
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

  // Commonjs, explicitly configured
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

  // Commonjs, source type module
  ...[
    {
      code: `require('dotenv');`,
      languageOptions: languageOptions.sourceTypeModule,
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
      languageOptions: languageOptions.sourceTypeModule,
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
      languageOptions: languageOptions.sourceTypeModule,
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
      languageOptions: languageOptions.sourceTypeModule,
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
      languageOptions: languageOptions.sourceTypeModule,
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
      languageOptions: languageOptions.sourceTypeModule,
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
      languageOptions: languageOptions.sourceTypeModule,
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
      languageOptions: languageOptions.sourceTypeModule,
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

  // Commonjs, explicitly configured & source type script
  ...[
    {
      code: `require('dotenv');`,
      options: [options.noCommonjs],
      languageOptions: languageOptions.sourceTypeScript,
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
      languageOptions: languageOptions.sourceTypeScript,
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
      languageOptions: languageOptions.sourceTypeScript,
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
      languageOptions: languageOptions.sourceTypeScript,
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
      languageOptions: languageOptions.sourceTypeScript,
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
      languageOptions: languageOptions.sourceTypeScript,
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
      languageOptions: languageOptions.sourceTypeScript,
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
      languageOptions: languageOptions.sourceTypeScript,
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

  // Commonjs, edge cases
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

  // A function called require
  ...[
    {
      code: `function require() {/* options */}`,
      options: [options.commonjs],
      errors: [
        {
          messageId: '1',
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 17
        }
      ]
    },
    {
      code: `function require() {/* sourceType */}`,
      languageOptions: languageOptions.sourceTypeScript,
      errors: [
        {
          messageId: '1',
          line: 1,
          column: 10,
          endLine: 1,
          endColumn: 17
        }
      ]
    },
    {
      code: `var require = function() { };`,
      options: [options.commonjs],
      errors: [
        {
          messageId: '1',
          line: 1,
          column: 5,
          endLine: 1,
          endColumn: 12
        }
      ]
    },
    {
      code: `var require = function require() { };`,
      options: [options.commonjs],
      errors: [
        {
          messageId: '1',
          line: 1,
          column: 5,
          endLine: 1,
          endColumn: 12
        }
      ]
    },
    {
      code: `var require = () => { };`,
      options: [options.commonjs],
      errors: [
        {
          messageId: '1',
          line: 1,
          column: 5,
          endLine: 1,
          endColumn: 12
        }
      ]
    },
    {
      code: `var require = "foobar";`,
      options: [options.commonjs],
      errors: [
        {
          messageId: '1',
          line: 1,
          column: 5,
          endLine: 1,
          endColumn: 12
        }
      ]
    }
  ],

  // Derived values
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
    },
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
      code: `const foo = \`\${bar()}\`;`,
      options: [options.allowDerived],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 16,
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

  // Derived values with side effects
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
  ],

  // Property access
  ...[
    {
      code: `const foo = bar.baz;`,
      options: [options.disallowPropertyAccess],
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
      code: `const foo = bar[0];`,
      options: [options.disallowPropertyAccess],
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
      code: `const {foo} = bar;`,
      options: [options.disallowPropertyAccess],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 7,
          endLine: 1,
          endColumn: 12
        }
      ]
    },
    {
      code: `const [foo] = bar;`,
      options: [options.disallowPropertyAccess],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 7,
          endLine: 1,
          endColumn: 12
        }
      ]
    },
    {
      code: `const foo = { bar: hello.world };`,
      options: [options.disallowPropertyAccess],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      code: `const foo = [bar.baz];`,
      options: [options.disallowPropertyAccess],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 21
        }
      ]
    },

    // MemberExpressions that should be reported only once.
    {
      code: `const foo = { bar: console.log("Hello world!") };`,
      options: [options.disallowPropertyAccess],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 20,
          endLine: 1,
          endColumn: 47
        }
      ]
    },
    {
      code: `foo.bar = "baz";`,
      options: [{allowPropertyAccess: false}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 17
        }
      ]
    }
  ],

  // Object declarations
  ...[
    {
      code: `const x = { foo: bad() };`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: `const x = { foo: { nested: { bar: bad() } } };`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 35,
          endLine: 1,
          endColumn: 40
        }
      ]
    },
    {
      code: `const x = { foo: bad(), bar: worse(), baz: worst() };`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 23
        },
        {
          messageId: '0',
          line: 1,
          column: 30,
          endLine: 1,
          endColumn: 37
        },
        {
          messageId: '0',
          line: 1,
          column: 44,
          endLine: 1,
          endColumn: 51
        }
      ]
    },
    {
      code: `const x = { foo: ok(), bar: fine(), baz: notThis() };`,
      options: [{allowedCalls: ['ok', 'fine']}],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 42,
          endLine: 1,
          endColumn: 51
        }
      ]
    },
    {
      code: `const x = { ...bad() };`,
      options: [options.allowDerived],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 21
        }
      ]
    },
    {
      code: `const x = { foo: new Foo() };`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      code: `const x = { foo: (function(){ return 1 })() };`,
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
      code: `const x = { foo: (() => 1)() };`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: `const x = { foo: 40 + 2 };`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: `const x = { foo: await bar() };`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 29
        }
      ]
    },
    {
      code: `module.exports = { foo: { bar: bad() } };`,
      options: [options.commonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 32,
          endLine: 1,
          endColumn: 37
        }
      ]
    },
    {
      code: `const x = { ...foo };`,
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
      code: `const x = { [foo]: true };`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 17
        }
      ]
    },
    {
      code: `const x = { [foo()]: true };`,
      options: [options.allowDerived],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 19
        }
      ]
    }
  ],

  // Array declarations
  ...[
    {
      code: `const arr = [foo()];`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 19
        }
      ]
    },
    {
      code: `const arr = [new Foo()];`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: `const arr = [await foo()];`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      code: `const arr = [3+14];`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `const arr = [(function() {})()];`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      code: `const arr = [(() => {})()];`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      code: `module.exports = [foo()];`,
      options: [options.commonjs],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: `module.exports.foobar = [foo()];`,
      options: [options.commonjs],
      languageOptions: languageOptions.sourceTypeScript,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 26,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      code: `exports = [foo()];`,
      options: [options.commonjs],
      languageOptions: languageOptions.sourceTypeScript,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 12,
          endLine: 1,
          endColumn: 17
        }
      ]
    },
    {
      code: `exports.foobar = [foo()];`,
      options: [options.commonjs],
      languageOptions: languageOptions.sourceTypeScript,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 19,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: `const arr = [3, [foo(), 1], 4];`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 18,
          endLine: 1,
          endColumn: 23
        }
      ]
    },
    {
      code: `
        const arr1 = [3, 1];
        const arr2 = [...arr1, 4];
      `,
      errors: [
        {
          messageId: '0',
          line: 2,
          column: 23,
          endLine: 2,
          endColumn: 30
        }
      ]
    },
    {
      code: `const arr = [...foo()];`,
      options: [options.allowDerived],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 17,
          endLine: 1,
          endColumn: 22
        }
      ]
    }
  ],

  // Function property assignment
  ...[
    {
      code: `
        function ComponentA() {}
        ComponentB.displayName = 'MyComponent';
      `,
      options: [options.allowFunctionProperties],
      errors: [
        {
          messageId: '0',
          line: 2,
          column: 9,
          endLine: 2,
          endColumn: 48
        }
      ]
    },
    {
      code: `
        function SomeReactComponent() {}
        SomeReactComponent[foo] = 'bar';
      `,
      options: [options.allowFunctionProperties],
      errors: [
        {
          messageId: '0',
          line: 2,
          column: 9,
          endLine: 2,
          endColumn: 41
        }
      ]
    },
    {
      code: `
        const x = {};
        x.y = "z";
      `,
      options: [options.allowFunctionProperties],
      errors: [
        {
          messageId: '0',
          line: 2,
          column: 9,
          endLine: 2,
          endColumn: 19
        }
      ]
    }
  ]
];

new RuleTester().run('no-top-level-side-effects', noTopLevelSideEffects, {
  valid: valid.map(trimTestCases),
  invalid: invalid.map(trimTestCases)
});
