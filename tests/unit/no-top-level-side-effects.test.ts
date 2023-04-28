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
  }
];

new RuleTester({
  parser,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
}).run('no-top-level-side-effects', noTopLevelSideEffects, {
  valid: valid.map(trimTestCases),
  invalid: invalid.map(trimTestCases)
});
