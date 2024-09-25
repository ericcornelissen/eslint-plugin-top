<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# No top level variables (no-top-level-variables)

Disallow top level variables.

Variables at the top level may indicate side effects because it may be used as
state in functions or methods. As such, `const` is the only kind of top-level
variable allowed by default, and it can only be assigned certain values.

## Rule Details

This rule lets you control top level variables.

Examples of **incorrect** code for this rule:

```javascript
var answer = 42;
let foo = 'bar';
const arr = [];
```

Examples of **correct** code for this rule:

```javascript
import * as util from 'node:util';

const leet = 1337;
const l33t = leet;

function f() {
  var answer = 42;
}

const g = () => {
  let foo = 'bar';
};

const h = function () {
  const arr = [];
};

export default function () {
  // ...
}

export const foo = 'bar';
```

```javascript
const util = require('node:util');

module.exports = {
  foo: 'bar'
};
```

### Options

This rule accepts a configuration object with two options:

- `allowed`: Configure what kind of assignments are allowed. Some assignments
  are always allowed, others need to be allowed explicitly.
- `kind`: Configure which kinds of variables are allowed. By default only
  `const` variables are allowed.

#### `allowed`

Examples of **correct** code when `'ArrayExpression'` is in the list:

```javascript
const arr = [1, 2, 3];
```

Examples of **correct** code when `'ObjectExpression'` is in the list:

```javascript
const hello = {world: '!'};
```

#### `kind`

Examples of **correct** code when `'const'` is in the list:

```javascript
const answer = 42;
const foo = 'bar';
const path = require('path');
```

Examples of **correct** code when `'let'` is in the list:

```javascript
let answer = 42;
let foo = 'bar';
let path = require('path');
```

Examples of **correct** code when `'var'` is in the list:

```javascript
var answer = 42;
var foo = 'bar';
var path = require('path');
```

Unless there is a historical or compatibility reason to allow `var` or `let`, it
is recommended to only allow `const`. By setting this to an empty list you can
disallow all top-level variables.

## When Not To Use It

If you want to allow top level variables.

---

Please [open an issue] if you found a mistake or if you have a suggestion for
how to improve the documentation.

[open an issue]: https://github.com/ericcornelissen/eslint-plugin-top/issues/new?labels=documentation&template=documentation.md
