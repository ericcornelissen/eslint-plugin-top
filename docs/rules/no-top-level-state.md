<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# No top level state (no-top-level-state)

Disallow top level state.

State at the top level indicates side effects because they may be used by
functions or methods, possibly changing their behavior over time. This is not
always problematic (e.g. a cache) but should be used sparingly.

## Rule Details

This rule lets you control top level state.

Examples of **incorrect** code for this rule:

```javascript
const array = ['foo', 'bar']; // arrays are mutable and therefore stateful
const object = {foo: 'bar'}; // objects are mutable and therefore stateful
const glob = /foobar/g; // The 'g' flag makes the regular expression stateful
const stick = /foobar/y; // The 'y' flag makes the regular expression stateful
var foo; // uninitialized variables can only be used for state
let bar; // uninitialized variables can only be used for state
```

Examples of **correct** code for this rule:

```javascript
import * as util from 'node:util';

const boolean = true;
const number = 3.14;
const string = 'Hello world!';
const regexp = /foobar/;

function f() {
  // ...
}
```

### Options

This rule accepts a configuration object with one option:

- `allow: []`: Configure what is allowed to be assigned to variables.

#### `allow`

Examples of correct code when `'ArrayExpression'` is in the list:

```javascript
const array = ['foo', 'bar'];
```

Examples of correct code when `'ObjectExpression'` is in the list:

```javascript
const object = {foo: 'bar'};
```

## When Not To Use It

If you want to allow top level state.

---

Please [open an issue] if you found a mistake or if you have a suggestion for
how to improve the documentation.

[open an issue]: https://github.com/ericcornelissen/eslint-plugin-top/issues/new?labels=documentation&template=documentation.md
