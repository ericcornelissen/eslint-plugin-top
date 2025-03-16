// SPDX-License-Identifier: ISC

import {RuleTester} from 'eslint';

import {trimTestCases} from './helpers';
import {noTopLevelVariables} from '../../lib/rules/no-top-level-variables';

const options: {
  [key: string]: {
    allowed?: string[];
    kind?: string[];
  };
} = {
  allowArray: {
    allowed: ['ArrayExpression']
  },
  allowObject: {
    allowed: ['ObjectExpression']
  },
  kindConst: {
    kind: ['const']
  },
  kindLet: {
    kind: ['let']
  },
  kindNone: {
    kind: []
  },
  kindVar: {
    kind: ['var']
  }
};

const valid: RuleTester.ValidTestCase[] = [
  // Non-top-level variables
  ...[
    {
      code: `
        function fVar() {
          var foo = 'bar';
        }
      `
    },
    {
      code: `
        function fLet() {
          let foo = 'bar';
        }
      `
    },
    {
      code: `
        function fConst() {
          const foo = 'bar';
        }
      `
    }
  ],

  // Top-level variables
  ...[
    {
      code: `
        var path = require('path');
        var foo1 = 'bar';
        export var foo2 = 'bar';
      `,
      options: [options.kindVar]
    },
    {
      code: `
        let path = require('path');
        let foo1 = 'bar';
        export let foo2 = 'bar';
      `,
      options: [options.kindLet]
    },
    {
      code: `
        const path = require('path');
        const foo1 = 'bar';
        export const foo2 = 'bar';
      `,
      options: [options.kindConst]
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
      code: `const str4 = $\`bar\`;`
    },
    {
      code: `const identifier = bar;`
    },
    {
      code: `const isArray = Array.isArray;`
    },
    {
      code: `const assignment = bar = 1;`
    },
    {
      code: `const binary = bar + baz;`
    },
    {
      code: `const logical = bar || baz;`
    },
    {
      code: `const unary = -bar;`
    },
    {
      code: `const update = i++;`
    },
    {
      code: `const ternary = bar ? bar : baz;`
    },
    {
      code: `const chain = foo?.bar;`
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
      code: `const symbol = Symbol();`
    },
    {
      code: `const bigInt = BigInt(1);`
    },
    {
      code: `const path = require('path');`
    },
    {
      code: `const promised = await h();`
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
    }
  ],

  // Export declarations
  ...[
    {
      code: `export class ClassName { }`
    },
    {
      code: `export function functionName() { }`
    },
    {
      code: `export function* generatorName() { }`
    },
    {
      code: `export const leet = 1337;`
    },
    {
      code: `export const leetBig = 1337n;`
    },
    {
      code: `export const negative = -1;`
    },
    {
      code: `export const regularExpression = /bar/;`
    },
    {
      code: `export const str1 = 'bar';`
    },
    {
      code: `export const str2 = "bar";`
    },
    {
      code: `export const str3 = \`bar\`;`
    },
    {
      code: `export const str4 = $\`bar\`;`
    },
    {
      code: `export const identifier = bar;`
    },
    {
      code: `export const isArray = Array.isArray;`
    },
    {
      code: `export const assignment = bar = 1;`
    },
    {
      code: `export const binary = bar + baz;`
    },
    {
      code: `export const logical = bar || baz;`
    },
    {
      code: `export const unary = -bar;`
    },
    {
      code: `export const update = i++;`
    },
    {
      code: `export const ternary = bar ? bar : baz;`
    },
    {
      code: `export const chain = foo?.bar;`
    },
    {
      code: `export const f = function() { };`
    },
    {
      code: `export const g = () => 'bar';`
    },
    {
      code: `export const { o1, o2: o3 } = o;`
    },
    {
      code: `export const [ a1, a2 ] = a;`
    },
    {
      code: `export const symbol = Symbol();`
    },
    {
      code: `export const bigInt = BigInt(1);`
    },
    {
      code: `export const promised = await h();`
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
      code: `export { name5, name6 } from "module-name";`
    },
    {
      code: `export { import1 as name7, import2 as name8, name9 } from "module-name";`
    },
    {
      code: `export { default as name10, name11 } from "module-name";`
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

  // Object/Array declarations
  ...[
    {
      code: `const foo = ["b", "a", "r"];`,
      options: [options.allowArray]
    },
    {
      code: `const foo = { bar: "baz" };`,
      options: [options.allowObject]
    }
  ],

  // Configurable allowed declarations
  ...[
    {
      code: `const foo = import('path');`
    },
    {
      code: `const foo = (3, 5);`
    },
    {
      code: `const foo = this;`
    },
    {
      code: `
        // Validate that 'ImportExpression' is not rejected as an allowed expression type
        const foo = import('path');
      `,
      options: [{allowed: ['ImportExpression']}]
    },
    {
      code: `
        // Validate that 'SequenceExpression' is not rejected as an allowed expression type
        const foo = (3, 5);
      `,
      options: [{allowed: ['SequenceExpression']}]
    },
    {
      code: `
        // Validate that 'ThisExpression' is not rejected as an allowed expression type
        const foo = this;
      `,
      options: [{allowed: ['ThisExpression']}]
    },
    {
      code: `// Validate that 'YieldExpression' is not rejected as an allowed expression type`,
      options: [{allowed: ['YieldExpression']}]
    }
  ]
];

const invalid: RuleTester.InvalidTestCase[] = [
  // Top-level variables
  ...[
    {
      code: `var foo = 'bar';`,
      options: [options.kindNone],
      errors: [
        {
          messageId: '1',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 17
        }
      ]
    },
    {
      code: `let foo = 'bar';`,
      options: [options.kindNone],
      errors: [
        {
          messageId: '2',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 17
        }
      ]
    },
    {
      code: `const foo = 'bar';`,
      options: [options.kindNone],
      errors: [
        {
          messageId: '3',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 19
        }
      ]
    }
  ],

  // Block statements
  ...[
    {
      code: `{var foo = 'bar';}`,
      options: [options.kindNone],
      errors: [
        {
          messageId: '1',
          line: 1,
          column: 2,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `{let foo = 'bar';}`,
      options: [options.kindNone],
      errors: [
        {
          messageId: '2',
          line: 1,
          column: 2,
          endLine: 1,
          endColumn: 18
        }
      ]
    },
    {
      code: `{const foo = 'bar';}`,
      options: [options.kindNone],
      errors: [
        {
          messageId: '3',
          line: 1,
          column: 2,
          endLine: 1,
          endColumn: 20
        }
      ]
    }
  ],

  // Export declarations
  ...[
    {
      code: `export var foo = 'bar';`,
      options: [options.kindNone],
      errors: [
        {
          messageId: '1',
          line: 1,
          column: 8,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: `export let foo = 'bar';`,
      options: [options.kindNone],
      errors: [
        {
          messageId: '2',
          line: 1,
          column: 8,
          endLine: 1,
          endColumn: 24
        }
      ]
    },
    {
      code: `export const foo = 'bar';`,
      options: [options.kindNone],
      errors: [
        {
          messageId: '3',
          line: 1,
          column: 8,
          endLine: 1,
          endColumn: 26
        }
      ]
    },
    {
      code: `export var name1, name2;`,
      errors: [
        {
          messageId: '1',
          line: 1,
          column: 8,
          endLine: 1,
          endColumn: 25
        }
      ]
    },
    {
      code: `export let name1, name2;`,
      errors: [
        {
          messageId: '2',
          line: 1,
          column: 8,
          endLine: 1,
          endColumn: 25
        }
      ]
    }
  ],

  // Multi-variable declarations
  ...[
    {
      code: `var foo = 'bar', hello = 'world';`,
      options: [options.kindNone],
      errors: [
        {
          messageId: '1',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      code: `let foo = 'bar', hello = 'world';`,
      options: [options.kindNone],
      errors: [
        {
          messageId: '2',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 34
        }
      ]
    },
    {
      code: `const foo = 'bar', hello = 'world';`,
      options: [options.kindNone],
      errors: [
        {
          messageId: '3',
          line: 1,
          column: 1,
          endLine: 1,
          endColumn: 36
        }
      ]
    }
  ],

  // Object declarations
  ...[
    {
      code: `const foo = {bar: "baz"};`,
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
      code: `const foo = {bar: "baz"}, hello = {world: "!"};`,
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
    }
  ],

  // Mixed multi-variable declarations
  ...[
    {
      code: `const path = require('path'), foo1 = {};`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 31,
          endLine: 1,
          endColumn: 40
        }
      ]
    },
    {
      code: `const foo = {}, fs = require('fs');`,
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 7,
          endLine: 1,
          endColumn: 15
        }
      ]
    }
  ],

  // Array/Object declarations with configuration
  ...[
    {
      code: `const arr = [];`,
      options: [options.allowObject],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 7,
          endLine: 1,
          endColumn: 15
        }
      ]
    },
    {
      code: `const foo = ["b", "a", "r"];`,
      options: [options.allowObject],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 7,
          endLine: 1,
          endColumn: 28
        }
      ]
    },
    {
      code: `const obj = {};`,
      options: [options.allowArray],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 7,
          endLine: 1,
          endColumn: 15
        }
      ]
    },
    {
      code: `const foo = { bar: "baz" };`,
      options: [options.allowArray],
      errors: [
        {
          messageId: '0',
          line: 1,
          column: 7,
          endLine: 1,
          endColumn: 27
        }
      ]
    }
  ]
];

new RuleTester().run('no-top-level-variables', noTopLevelVariables, {
  valid: valid.map(trimTestCases),
  invalid: invalid.map(trimTestCases)
});
