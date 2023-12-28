<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# No top level side effect (no-top-level-side-effects)

Disallow top level side effects.

Side effects at the top level can have some negative consequences such as slow
startup times and, for libraries, unexpected behavior. This covers top level
expression as well as assignments.

## Rule Details

This rule lets you control top level side effects.

Examples of **incorrect** code for this rule:

```javascript
console.log('hello world');
```

```javascript
if (typeof Array.prototype.map !== 'function') {
  Array.prototype.map = () => {
    // Implement polyfill
  };
}
```

```javascript
let s = 0;
for (let i = 0; i < 10; i++) {
  s += i;
}
```

```javascript
fetch('/api').then((res) => res.text());
```

Examples of **correct** code for this rule:

```javascript
export default function () {
  console.log('hello world');

  let s = 0;
  for (let i = 0; i < 10; i++) {
    s += i;
  }

  fetch('/api').then((res) => res.text());
}
```

```javascript
module.exports = function () {
  console.log('hello world');

  let s = 0;
  for (let i = 0; i < 10; i++) {
    s += i;
  }

  fetch('/api').then((res) => res.text());
};
```

### Options

This rule accepts a configuration object with four options:

- `allowedCalls` Configure what function calls are allowed at the top level. Can
  be any identifier. The default value covers standard JavaScript functions that
  one might expect at the top level (such as `BigInt` and `Symbol`).
- `allowedNews` Configure what classes can be instantiated at the top level. Can
  be any identifier. By default no classes can be instantiated.
- `allowIIFE: false` (default) Configure whether top level Immediately Invoked
  Function Expressions (IIFEs) are allowed.
- `allowDerived: false` (default) Configure whether derivations - binary,
  logical, or unary operations on values and variables - are allowed at the top
  level.
- `commonjs: false` (default) Configure whether the code being analyzed is, or
  is partially, CommonJS code. Allows the use `require`, `module.exports` and
  `exports` at the top level.

#### `allowedCalls`

Example of **correct** code when `'f'` is in the list:

```javascript
function f() {}

const x = f();
export const y = f();
export default f();
```

By setting this to an empty list you can disallow all top-level function calls.

#### `allowedNews`

Example of **correct** code when `'Map'` is in the list:

```javascript
const m = new Map();
```

By setting this to an empty list you can disallow all top-level class
instantiations.

#### `allowIIFE`

Examples of **correct** code when `'allowIIFE'` is set to `true`:

```javascript
(function () {
  console.log('hello world');

  let s = 0;
  for (let i = 0; i < 10; i++) {
    s += i;
  }

  fetch('/api').then((res) => res.text());
})();
```

```javascript
(() => {
  console.log('hello world');

  let s = 0;
  for (let i = 0; i < 10; i++) {
    s += i;
  }

  fetch('/api').then((res) => res.text());
})();
```

#### `allowDerived`

Examples of **correct** code when `'allowDerived'` is set to `true`:

```javascript
const a = 0; // (always allowed)
const b = 1; // (always allowed)

const b01 = a == b;
const b02 = a != b;
const b03 = a === b;
const b04 = a !== b;
const b05 = a < b;
const b06 = a <= b;
const b07 = a > b;
const b08 = a >= b;
const b09 = a << b;
const b10 = a >> b;
const b11 = a >>> b;
const b12 = a + b;
const b13 = a - b;
const b14 = a * b;
const b15 = a / b;
const b16 = a % b;
const b17 = a ** b;
const b18 = a | b;
const b19 = a ^ b;
const b20 = a & b;
const b21 = a in b;
const b22 = a instanceof b;

const l01 = a && b;
const l02 = a || b;
const l03 = a ?? b;

const u01 = -a;
const u02 = +a;
const u03 = !a;
const u04 = ~a;
```

#### `commonjs`

Examples of **correct** code when `'commonjs'` is set to `true`:

```javascript
require('dotenv');
var cp = require('child_process');
let fs = require('fs');
const path = require('path');

module.exports = {};
module.exports.foo = 'bar';
exports = {};
exports.foo = 'bar';
```

## When Not To Use It

If you want to allow top level side effects.

---

Please [open an issue] if you found a mistake or if you have a suggestion for
how to improve the documentation.

[open an issue]: https://github.com/ericcornelissen/eslint-plugin-top/issues/new?labels=documentation&template=documentation.md
