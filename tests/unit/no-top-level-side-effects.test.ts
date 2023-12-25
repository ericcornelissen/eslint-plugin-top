// SPDX-License-Identifier: ISC

import * as parser from '@typescript-eslint/parser';
import {RuleTester} from 'eslint';

import {trimTestCases} from './helpers';
import {noTopLevelSideEffects} from '../../lib/rules/no-top-level-side-effects';

const valid: RuleTester.ValidTestCase[] = [
  {
    code: `
      (function() {
        return '';
      })();
    `,
    options: [
      {
        allowIIFE: true
      }
    ]
  },
  {
    code: `
      (() => {
        return '';
      })();
    `,
    options: [
      {
        allowIIFE: true
      }
    ]
  },
  {
    code: `
    export function foobar() {}
    `
  },
  {
    code: `
      module.exports = {};
      exports = {};
      exports.foobar = {};
    `
  },
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
      export const hello = 'world';
    `
  },
  {
    code: `
      const s1 = Symbol();
      export const s2 = Symbol();
    `
  },
  {
    code: `
      const s1 = Symbol();
      export const s2 = Symbol();
    `,
    options: [
      {
        allowSymbol: true
      }
    ]
  },
  {
    code: `
      var fs = require('fs');
      let cp = require('child_process');
      const path = require('path');
    `
  },
  {
    code: `
      const foo = -1;
    `
  },
  {
    code: `
      const foo = \`bar\`;
    `
  }
];

const invalid: RuleTester.InvalidTestCase[] = [
  {
    code: `
      console.log('hello world');
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 28
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
        messageId: 'message',
        line: 1,
        column: 1,
        endLine: 3,
        endColumn: 8
      }
    ]
  },
  {
    code: `
      fetch('/api').then(res=>res.text()).then(console.log);
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 55
      }
    ]
  },
  {
    code: `
      switch (foo) {}
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 16
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
        messageId: 'message',
        line: 2,
        column: 9,
        endLine: 2,
        endColumn: 36
      }
    ]
  },
  {
    code: `
      notModule.exports = {};
    `,
    errors: [
      {
        messageId: 'message',
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
    errors: [
      {
        messageId: 'message',
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
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 24
      }
    ]
  },
  {
    code: `
      do {
        i++;
        s += i;
      } while (i<10);
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 1,
        endLine: 4,
        endColumn: 22
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
        messageId: 'message',
        line: 1,
        column: 1,
        endLine: 3,
        endColumn: 8
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
        messageId: 'message',
        line: 1,
        column: 1,
        endLine: 3,
        endColumn: 8
      }
    ]
  },
  {
    code: `
      throw new Error('Hello world!');
    `,
    errors: [
      {
        messageId: 'message',
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
        messageId: 'message',
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
        messageId: 'message',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 34
      }
    ]
  },
  {
    code: `
      (function() {
        return '';
      })();
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 1,
        endLine: 3,
        endColumn: 12
      }
    ]
  },
  {
    code: `
      (() => {
        return '';
      })();
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 1,
        endLine: 3,
        endColumn: 12
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
        messageId: 'message',
        line: 1,
        column: 1,
        endLine: 1,
        endColumn: 28
      }
    ]
  },
  {
    code: `
      module.exports = console.log('hello world');
      export const hello = console.log('hello world');
      var foo1 = console.log('bar1');
      let foo2 = console.log('bar2');
      const foo3 = console.log('bar3');
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 18,
        endLine: 1,
        endColumn: 44
      },
      {
        messageId: 'message',
        line: 2,
        column: 28,
        endLine: 2,
        endColumn: 54
      },
      {
        messageId: 'message',
        line: 3,
        column: 18,
        endLine: 3,
        endColumn: 37
      },
      {
        messageId: 'message',
        line: 4,
        column: 18,
        endLine: 4,
        endColumn: 37
      },
      {
        messageId: 'message',
        line: 5,
        column: 20,
        endLine: 5,
        endColumn: 39
      }
    ]
  },
  {
    code: `
      module.exports = (function() { })();
      export const hello = (function() { })();
      var foo1 = (function() { })();
      let foo2 = (function() { })();
      const foo3 = (function() { })();
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 18,
        endLine: 1,
        endColumn: 36
      },
      {
        messageId: 'message',
        line: 2,
        column: 28,
        endLine: 2,
        endColumn: 46
      },
      {
        messageId: 'message',
        line: 3,
        column: 18,
        endLine: 3,
        endColumn: 36
      },
      {
        messageId: 'message',
        line: 4,
        column: 18,
        endLine: 4,
        endColumn: 36
      },
      {
        messageId: 'message',
        line: 5,
        column: 20,
        endLine: 5,
        endColumn: 38
      }
    ]
  },
  {
    code: `
      module.exports = (() => { })();
      export const hello = (() => { })();
      var foo1 = (() => { })();
      let foo2 = (() => { })();
      const foo3 = (() => { })();
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 18,
        endLine: 1,
        endColumn: 31
      },
      {
        messageId: 'message',
        line: 2,
        column: 28,
        endLine: 2,
        endColumn: 41
      },
      {
        messageId: 'message',
        line: 3,
        column: 18,
        endLine: 3,
        endColumn: 31
      },
      {
        messageId: 'message',
        line: 4,
        column: 18,
        endLine: 4,
        endColumn: 31
      },
      {
        messageId: 'message',
        line: 5,
        column: 20,
        endLine: 5,
        endColumn: 33
      }
    ]
  },
  {
    code: `
      module.exports = new HelloWorld();
      export const hello = new HelloWorld();
      var foo1 = new Bar();
      let foo2 = new Bar();
      const foo3 = new Bar();
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 18,
        endLine: 1,
        endColumn: 34
      },
      {
        messageId: 'message',
        line: 2,
        column: 28,
        endLine: 2,
        endColumn: 44
      },
      {
        messageId: 'message',
        line: 3,
        column: 18,
        endLine: 3,
        endColumn: 27
      },
      {
        messageId: 'message',
        line: 4,
        column: 18,
        endLine: 4,
        endColumn: 27
      },
      {
        messageId: 'message',
        line: 5,
        column: 20,
        endLine: 5,
        endColumn: 29
      }
    ]
  },
  {
    code: `
      const f1 = f();
      export const f2 = f();
    `,
    options: [
      {
        allowSymbol: true
      }
    ],
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 12,
        endLine: 1,
        endColumn: 15
      },
      {
        messageId: 'message',
        line: 2,
        column: 25,
        endLine: 2,
        endColumn: 28
      }
    ]
  },
  {
    code: `
      const s1 = Symbol();
      export const s2 = Symbol();
    `,
    options: [
      {
        allowSymbol: false
      }
    ],
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 12,
        endLine: 1,
        endColumn: 20
      },
      {
        messageId: 'message',
        line: 2,
        column: 25,
        endLine: 2,
        endColumn: 33
      }
    ]
  },
  {
    code: `
      const path = require('path');
    `,
    options: [
      {
        allowRequire: false
      }
    ],
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 14,
        endLine: 1,
        endColumn: 29
      }
    ]
  },
  {
    code: `
      const foo = await bar();
    `,
    errors: [
      {
        messageId: 'message',
        line: 1,
        column: 13,
        endLine: 1,
        endColumn: 24
      }
    ]
  },
  {
    code: `
      const foo = 1 + 2;
    `,
    errors: [
      {
        messageId: 'message',
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
        messageId: 'message',
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
        messageId: 'message',
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
        messageId: 'message',
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
        messageId: 'message',
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
        messageId: 'message',
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
        messageId: 'message',
        line: 1,
        column: 13,
        endLine: 1,
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
