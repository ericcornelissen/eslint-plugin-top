# No top level variables (no-top-level-variables)

Based on [eslint-plugin-toplevel].

## Rule Details

Lets you disallow top level variables.

Examples of **incorrect** code for this rule:

```javascript
var foo = 42;
const bar = new Array();
let baz = 0;

// Rest of your code
```

Examples of **correct** code for this rule:

```javascript
const bar = 1337;

export default function () {
  var foo = 42;
  const bar = new Array();
  let baz = 0;

  // Rest of your code
}
```

### Options

```yml
rules:
  '@ericcornelissen/top/no-top-level-variables':
    - error
    - constAllowed:
        - Literal
        - MemberExpression
      kind:
        - const
        - let
        - var
```

#### constAllowed

Allows to customize what kinds of assignments are allowed for `const`.

Default is: `["Literal", "MemberExpression"]`

Examples of **correct** code when `'Literal'` is allowed:

```javascript
const foo = 42;
const hello = 'world!';
const NULL = null;
```

Examples of **correct** code when `'MemberExpression'` is allowed:

```javascript
const parse = JSON.parse;
const map = Array.prototype.map;
```

#### kind

Allows to only forbid specific kinds of variables.

Default is: `["const", "let", "var"]`

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

[eslint-plugin-toplevel]: https://github.com/HKalbasi/eslint-plugin-toplevel
[open an issue]: https://github.com/ericcornelissen/eslint-plugin-top/issues/new?labels=documentation&template=documentation.md
