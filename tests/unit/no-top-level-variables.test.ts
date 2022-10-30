import * as parser from '@typescript-eslint/parser';
import {RuleTester} from 'eslint';
import {trimTestCases} from '../../lib/helpers';
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
      export default function () {
      }
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
        messageId: 'message'
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
        messageId: 'message'
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
        messageId: 'message'
      }
    ]
  },
  {
    code: `
      var foo;
    `,
    errors: [
      {
        messageId: 'message'
      }
    ]
  },
  {
    code: `
      var foo = 'bar', hello = 'world';
    `,
    errors: [
      {
        messageId: 'message'
      }
    ]
  },
  {
    code: `
      let foo = 'bar', hello = 'world';
    `,
    errors: [
      {
        messageId: 'message'
      }
    ]
  },
  {
    code: `
      const foo = 'bar', hello = world();
    `,
    errors: [
      {
        messageId: 'message'
      }
    ]
  },
  {
    code: `
      var path = require('path'), foo = 'bar';
    `,
    errors: [
      {
        messageId: 'message'
      }
    ]
  },
  {
    code: `
      let path = require('path'), foo = 'bar';
    `,
    errors: [
      {
        messageId: 'message'
      }
    ]
  },
  {
    code: `
      const path = require('path'), foo = bar();
    `,
    errors: [
      {
        messageId: 'message'
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
