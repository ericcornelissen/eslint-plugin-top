import * as parser from '@typescript-eslint/parser';
import {RuleTester} from 'eslint';
import {trimTestCases} from './helpers';
import {noTopLevelSideEffect} from '../../lib/rules/no-top-level-side-effect';

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
  }
];

new RuleTester({
  parser,
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
}).run('no-top-level-side-effect', noTopLevelSideEffect, {
  valid: valid.map(trimTestCases),
  invalid: invalid.map(trimTestCases)
});
