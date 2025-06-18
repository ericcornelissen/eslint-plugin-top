<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# eslint-plugin-top

Disallow side effects at the top level of files.

**Quick links**:
[npm][npm-url] |
[Source code] |
[License] |
[Changelog] |
[Security]

## Installation

First, If you haven't already, install [ESLint]:

```shell
npm install eslint --save-dev
```

Then, install `eslint-plugin-top`:

```shell
npm install @ericcornelissen/eslint-plugin-top --save-dev
```

## Usage

### New Config (since ESLint v9)

Import from `@ericcornelissen/eslint-plugin-top` and use one of the [preset
configurations](#preset-configurations), e.g.:

```javascript
import top from '@ericcornelissen/eslint-plugin-top';

export default [
  top.configs.recommended,
  // or
  top.configs.strict
  // ...
];
```

Or configure the rules you want to use in the rules section, e.g.:

```javascript
import top from '@ericcornelissen/eslint-plugin-top';

export default [
  {
    plugins: {top},
    rules: {
      'top/no-top-level-side-effects': 'error',
      'top/no-top-level-variables': 'error'
    }
  }
];
```

Note that the rule prefix (`top` in the example) must match the name of the key
used in the plugins object.

### Legacy Config (before ESLint v9)

First, add `@ericcornelissen/top` to the plugins section of your `.eslintrc`
configuration file. You must omit the `eslint-plugin-` infix:

```yml
plugins:
  - '@ericcornelissen/top'
```

Then, configure the rules you want to use in the rules section:

```yml
rules:
  '@ericcornelissen/top/no-top-level-side-effects': error
  '@ericcornelissen/top/no-top-level-variables': error
```

## Supported Rules

- [`no-top-level-side-effects`]
- [`no-top-level-variables`]

## Preset Configurations

- `recommended`: disallow top level variables while allowing mutable values and
  disallows top level side effects except for creating things like `Symbol`s.
- `strict`: disallow all top level variables and side effects except for
  importing other files.

---

Please [open an issue] if you found a mistake or if you have a suggestion for
how to improve the documentation.

[changelog]: ./CHANGELOG.md
[eslint]: https://eslint.org/
[license]: ./LICENSE
[npm-url]: https://www.npmjs.com/package/@ericcornelissen/eslint-plugin-top
[open an issue]: https://github.com/ericcornelissen/eslint-plugin-top/issues/new?labels=documentation&template=documentation.md
[security]: ./SECURITY.md
[source code]: https://github.com/ericcornelissen/eslint-plugin-top
[`no-top-level-side-effects`]: docs/rules/no-top-level-side-effects.md
[`no-top-level-variables`]: docs/rules/no-top-level-variables.md
