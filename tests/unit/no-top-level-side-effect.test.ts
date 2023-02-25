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
    `
  },
  {
    code: `
      (() => {
        return '';
      })();
    `
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

const errors = [
  {
    messageId: 'message'
  }
];

const invalid: RuleTester.InvalidTestCase[] = [
  {
    code: `
      console.log('hello world');
    `,
    errors
  },
  {
    code: `
      for (let i=0;i<10;i++) {
        s += i;
      }
    `,
    errors
  },
  {
    code: `
      fetch('/api').then(res=>res.text()).then(console.log);
    `,
    errors
  },
  {
    code: `
      switch (foo) {}
    `,
    errors
  },
  {
    code: `
      {
        console.log('hello world');
      }
    `,
    errors
  },
  {
    code: `
      notModule.exports = {};
    `,
    errors
  },
  {
    code: `
      notExports = {};
    `,
    errors
  },
  {
    code: `
      notExports.foobar = {};
    `,
    errors
  },
  {
    code: `
      do {
        i++;
        s += i;
      } while (i<10);
    `,
    errors
  },
  {
    code: `
      for (let i of [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        s += i;
      }
    `,
    errors
  },
  {
    code: `
      for (let i in [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]) {
        s += i;
      }
    `,
    errors
  },
  {
    code: `
      throw new Error('Hello world!');
    `,
    errors
  },
  {
    code: `
      try { } catch (e) { }
    `,
    errors
  },
  {
    code: `
      try { } catch (e) { } finally { }
    `,
    errors
  },
  {
    code: `
      (function() {
        return '';
      })();
    `,
    options: [
      {
        allowIIFE: false
      }
    ],
    errors
  },
  {
    code: `
      (() => {
        return '';
      })();
    `,
    options: [
      {
        allowIIFE: false
      }
    ],
    errors
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
