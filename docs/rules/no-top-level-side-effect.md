# No top level side effect (no-top-level-side-effect)

Based on [eslint-plugin-toplevel].

## Rule Details

Lets you disallow top level side effects.

Examples of **incorrect** code for this rule:

```javascript
console.log('hello world');
let s = 0;
for (let i = 0; i < 10; i++) {
  s += i;
}
console.log(s);
fetch('/api')
  .then((res) => res.text())
  .then(console.log);
```

Examples of **correct** code for this rule:

```javascript
export default function () {
  console.log('hello world');
  let s = 0;
  for (let i = 0; i < 10; i++) {
    s += i;
  }
  console.log(s);
  fetch('/api')
    .then((res) => res.text())
    .then(console.log);
}
```

```javascript
(function () {
  console.log('hello world');
  let s = 0;
  for (let i = 0; i < 10; i++) {
    s += i;
  }
  console.log(s);
  fetch('/api')
    .then((res) => res.text())
    .then(console.log);
})();
```

```javascript
module.exports = () => {
  console.log('hello world');
  let s = 0;
  for (let i = 0; i < 10; i++) {
    s += i;
  }
  console.log(s);
  fetch('/api')
    .then((res) => res.text())
    .then(console.log);
};
```

```javascript
(() => {
  console.log('hello world');
  let s = 0;
  for (let i = 0; i < 10; i++) {
    s += i;
  }
  console.log(s);
  fetch('/api')
    .then((res) => res.text())
    .then(console.log);
})();
```

## When Not To Use It

If you want to allow top level side effects.

---

Please [open an issue] if you found a mistake or if you have a suggestion for
how to improve the documentation.

[eslint-plugin-toplevel]: https://github.com/HKalbasi/eslint-plugin-toplevel
[open an issue]: https://github.com/ericcornelissen/eslint-plugin-top/issues/new?labels=documentation&template=documentation.md
