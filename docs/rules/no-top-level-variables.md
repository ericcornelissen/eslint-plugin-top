# No top level variables (no-top-level-variables)

Based on [eslint-plugin-toplevel].

## Rule Details

Lets you disallow top level variables.

Examples of **incorrect** code for this rule:

```js
var foo = 42;
const bar = new Bar();
let baz = 0;

// Rest of your code
```

Examples of **correct** code for this rule:

```js
const bar = 1337;

export default function () {
  var foo = 42;
  const bar = new Bar();
  let baz = 0;

  // Rest of your code
}
```

### Options

```json
{
  "rules": {
    "@ericcornelissen/top/no-top-level-variables": [
      "error",
      {
        "kind": ["const", "let", "var"]
      }
    ]
  }
}
```

#### kind

Allows to only forbid specific kinds of variables.

Default is `["const", "let", "var"]`

## When Not To Use It

If you want to allow top level variables

---

Please [open an issue] if you found a mistake or if you have a suggestion for
how to improve the documentation.

[eslint-plugin-toplevel]: https://github.com/HKalbasi/eslint-plugin-toplevel
[open an issue]: https://github.com/ericcornelissen/eslint-plugin-top/issues/new?labels=documentation&template=documentation.md
