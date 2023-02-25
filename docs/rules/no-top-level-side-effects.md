# No top level side effect (no-top-level-side-effects)

Disallow top level side effects.

Side effects at the top level can have various negative side effects including
but not limited to slow startup times and unexpected behaviour (in particular
for libraries).

## Rule Details

This rule lets you control top level side effects.

Examples of **incorrect** code for this rule:

```javascript
console.log('hello world');
```

```javascript
if (typeof Array.prototype.map !== 'function') {
  Array.prototype.map = () => {
    /* Implement polyfill */
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

This rule accepts a configuration object with one option:

- `allowIIFE: true` (default) Configure whether top level Immediately Invoked
  Function Expressions are allowed.

#### allowIIFE

Examples of **incorrect** code when set to `false`:

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

## When Not To Use It

If you want to allow top level side effects.

---

Please [open an issue] if you found a mistake or if you have a suggestion for
how to improve the documentation.

[open an issue]: https://github.com/ericcornelissen/eslint-plugin-top/issues/new?labels=documentation&template=documentation.md
