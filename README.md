# eslint-plugin-top

Disallow side effects at the top level of files

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-top`:

```sh
npm install @ericcornelissen/eslint-plugin-top --save-dev
```

## Usage

Add `top` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["@ericcornelissen/top"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "@ericcornelissen/top/no-top-level-variables": 2,
    "@ericcornelissen/top/no-top-level-side-effect": 2
  }
}
```

## Supported Rules

- [`no-top-level-variables`](./docs/rules/no-top-level-variables.md)
- [`no-top-level-side-effect`](./docs/rules/no-top-level-side-effect.md)
