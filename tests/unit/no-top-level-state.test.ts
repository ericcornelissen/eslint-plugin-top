// SPDX-License-Identifier: ISC

import {RuleTester} from 'eslint';

import {trimTestCases} from './helpers';
import {noTopLevelState} from '../../lib/rules/no-top-level-state';

const options: {
  [key: string]: {
    allow?: string[];
  };
} = {
  allowArray: {
    allow: ['ArrayExpression']
  },
  allowObject: {
    allow: ['ObjectExpression']
  }
};

const valid: RuleTester.ValidTestCase[] = [
  // Not top level
  ...[
    {
      code: `
        function f() {
          const boolean = true;
          const number = 3.14;
          const string = 'Hello world!';
        }
      `
    },
    {
      code: `
        function f() {
          const array = [];
        }
      `
    },
    {
      code: `
        function f() {
          const object = [];
        }
      `
    },
    {
      code: `
        function f() {
          const regexpNoFlags = /bar/;
        }
      `
    },
    {
      code: `
        function f() {
          const regexpDotAll = /bar/s;
        }
      `
    },
    {
      code: `
        function f() {
          const regexpGlobal = /bar/g;
        }
      `
    },
    {
      code: `
        function f() {
          const regexpHasIndices = /bar/d;
        }
      `
    },
    {
      code: `
        function f() {
          const regexpIgnoreCase = /bar/i;
        }
      `
    },
    {
      code: `
        function f() {
          const regexpMultiline = /bar/m;
        }
      `
    },
    {
      code: `
        function f() {
          const regexpSticky = /bar/y;
        }
      `
    },
    {
      code: `
        function f() {
          const regexpUnicode = /bar/u;
        }
      `
    },
    {
      code: `
        function f() {
          const regexpUnicodeSets = /bar/v;
        }
      `
    },
    {
      code: `
        function f() {
          var uninitialized;
          var initialized1 = 'foobar';
        }
      `
    },
    {
      code: `
        function f() {
          let uninitialized;
          let initialized1 = 'foobar';
        }
      `
    }
  ],

  // Top-level value assignments
  ...[
    {
      code: `const b1 = true;`
    },
    {
      code: `const b2 = false;`
    },
    {
      code: `const n1 = 42;`
    },
    {
      code: `const n2 = 3.14;`
    },
    {
      code: `const n3 = 9001n;`
    },
    {
      code: `const str1 = "foobar";`
    },
    {
      code: `const str2 = 'foobar';`
    },
    {
      code: `const str3 = \`foobar\`;`
    }
  ],

  // Top-level array
  ...[
    {
      code: `
        const array = [/*empty*/];
      `,
      options: [options.allowArray]
    },
    {
      code: `
        const array = ["non", "empty"];
      `,
      options: [options.allowArray]
    }
  ],

  // Top-level object
  ...[
    {
      code: `
        const object = {/*empty*/};
      `,
      options: [options.allowObject]
    },
    {
      code: `
        const object = { non: "empty" };
      `,
      options: [options.allowObject]
    }
  ],

  // Top-level stateless regular expressions
  ...[
    {
      code: `const regexpNoFlags = /bar/;`
    },
    {
      code: `const regexpDotAll = /bar/s;`
    },
    {
      code: `const regexpHasIndices = /bar/d;`
    },
    {
      code: `const regexpIgnoreCase = /bar/i;`
    },
    {
      code: `const regexpMultiline = /bar/m;`
    },
    {
      code: `const regexpUnicode = /bar/u;`
    },
    {
      code: `const regexpUnicodeSets = /bar/v;`
    }
  ]
];

const invalid: RuleTester.InvalidTestCase[] = [
  // Top-level array
  ...[
    {
      code: `
        const array = [/*empty*/];
      `,
      errors: [
        {
          messageId: '1',
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      code: `
        const array = ["non", "empty"];
      `,
      errors: [
        {
          messageId: '1',
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      code: `
        const array = ["even", "when", "objects", "are", "allowed"];
      `,
      options: [options.allowObject],
      errors: [
        {
          messageId: '1',
          line: 1,
          column: 15,
          endLine: 1,
          endColumn: 60
        }
      ]
    }
  ],

  // Top-level object
  ...[
    {
      code: `
        const object = {/*empty*/};
      `,
      errors: [
        {
          messageId: '2',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 27
        }
      ]
    },
    {
      code: `
        const object = { non: "empty" };
      `,
      errors: [
        {
          messageId: '2',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 32
        }
      ]
    },
    {
      code: `
        const object = { even: "when arrays are allowed" };
      `,
      options: [options.allowArray],
      errors: [
        {
          messageId: '2',
          line: 1,
          column: 16,
          endLine: 1,
          endColumn: 51
        }
      ]
    }
  ],

  // Top-level stateful regular expressions
  ...[
    {
      code: `
        const regexpGlobal = /foobar/g;
      `,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 31
        }
      ]
    },
    {
      code: `
        const regexpSticky = /foobar/y;
      `,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 22,
          endLine: 1,
          endColumn: 31
        }
      ]
    }
  ],

  // Top-level variable
  ...[
    {
      code: `
        var uninitialized;
      `,
      errors: [
        {
          messageId: '3',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 19
        }
      ]
    },
    {
      code: `
        var initialized = 'foobar';
      `,
      errors: [
        {
          messageId: '3',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      code: `
        let uninitialized;
      `,
      errors: [
        {
          messageId: '4',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 19
        }
      ]
    },
    {
      code: `
        let initialized = 'foobar';
      `,
      errors: [
        {
          messageId: '4',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 28
        }
      ]
    }
  ]
];

new RuleTester().run('no-top-level-state', noTopLevelState, {
  valid: valid.map(trimTestCases),
  invalid: invalid.map(trimTestCases),
  assertionOptions: {
    requireData: true,
    requireLocation: true,
    requireMessage: true
  }
});
