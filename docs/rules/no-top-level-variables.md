# No top level variables (no-top-level-variables)

> [!WARNING]
> Version 2 of `@ericcornelissen/eslint-plugin-top` is end-of-life (EOL) since
> 2024-03-26. No support for this version will be provided going forward. You
> can upgrade to the latest version instead.

Disallow top level variables.

Variables at the top level may indicate side effects. It may be initialized by
means of a function call, which is a side effect. Or it may be used as state in
the functions or methods of the module, which means it's used for side effects.

As such, `const` is handled differently from `let` and `var` since it's value is
not meant to be mutated.

## Rule Details

This rule lets you control top level variable assignments.

Examples of **incorrect** code for this rule:

```javascript
var answer = 42;
let foo = 'bar';
const list = new Array();
```

Examples of **correct** code for this rule:

```javascript
var fs = require('node:fs');
let path = require('node:path');
const util = require('node:util');
```

```javascript
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as util from 'node:util';

const leet = 1337;

export default function () {
  var answer = 42;
  let foo = 'bar';
  const list = new Array();
}
```

### Options

This rule accepts a configuration object with two options:

- `constAllowed`: Configure what assignments are allowed for `const`. By default
  functions, literals, and member expression assignments are allowed.
- `kind`: Configure which kinds of variables are forbidden. By default all of
  `const`, `let`, and `var` are forbidden.

#### constAllowed

Examples of **correct** code when `'ArrayExpression'` is allowed:

```javascript
const arr = [1, 2, 3];
```

Examples of **correct** code when `'ArrowFunctionExpression'` is allowed:

```javascript
const answer = () => 42;
const hello = (name) => `Hello ${name}!`;
```

Examples of **correct** code when `'FunctionExpression'` is allowed:

```javascript
const answer = function () {
  return 42;
};
const hello = function (name) {
  return `Hello ${name}!`;
};
```

Examples of **correct** code when `'Literal'` is allowed:

```javascript
const answer = 42;
const hello = 'world!';
const NULL = null;
```

Examples of **correct** code when `'MemberExpression'` is allowed:

```javascript
const parse = JSON.parse;
const map = Array.prototype.map;
```

Examples of **correct** code when `'ObjectExpression'` is allowed:

```javascript
const obj = {foo: 'bar'};
```

Examples of **correct** code when `'TemplateLiteral'` is allowed:

```javascript
const foo = `bar`;
```

#### kind

Examples of **correct** code when `'const'` is not in the list:

```javascript
const answer = 42;
const list = new Array();
const foobar = JSON.parse('{"foo":"bar"}');
```

Examples of **correct** code when `'let'` is not in the list:

```javascript
let answer = 42;
let list = new Array();
let foobar = JSON.parse('{"foo":"bar"}');
```

Examples of **correct** code when `'var'` is not in the list:

```javascript
var answer = 42;
var list = new Array();
var foobar = JSON.parse('{"foo":"bar"}');
```

## When Not To Use It

If you want to allow top level variables.

---

Please [open an issue] if you found a mistake or if you have a suggestion for
how to improve the documentation.

[open an issue]: https://github.com/ericcornelissen/eslint-plugin-top/issues/new?labels=documentation&template=documentation.md
