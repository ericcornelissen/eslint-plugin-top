# eslint-plugin-top

Disallow side effects at the top level of files.

## Installation

You'll first need to install [ESLint]:

```shell
npm install eslint --save-dev
```

Next, install `eslint-plugin-top`:

```shell
npm install @ericcornelissen/eslint-plugin-top --save-dev
```

## Usage

Add `@ericcornelissen/top` to the plugins section of your `.eslintrc` config
file. You can omit the `eslint-plugin-` infix:

```yaml
plugins:
  - '@ericcornelissen/top'
```

Then, configure the rules you want to use under the rules section:

```yaml
rules:
  '@ericcornelissen/top/no-top-level-variables': error
  '@ericcornelissen/top/no-top-level-side-effect': error
```

## Supported Rules

- [`no-top-level-variables`]
- [`no-top-level-side-effect`]

---

Please [open an issue] if you found a mistake or if you have a suggestion for
how to improve the documentation.

[eslint]: https://eslint.org/
[open an issue]: https://github.com/ericcornelissen/eslint-plugin-top/issues/new?labels=documentation&template=documentation.md
[`no-top-level-variables`]: docs/rules/no-top-level-variables.md
[`no-top-level-side-effect`]: docs/rules/no-top-level-side-effect.md
