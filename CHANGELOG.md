<!-- SPDX-License-Identifier: CC0-1.0 -->

# Changelog

All notable changes to `@ericcornelissen/eslint-plugin-top` will be documented
in this file.

The format is based on [Keep a Changelog], and this project adheres to [Semantic
Versioning].

## [Unreleased]

- ([#1774]) Add support for ESLint v10.

## [3.6.0] - 2025-08-23

- ([#1603]) Create new `no-top-level-state` rule.
- ([#1603]) Disallow top-level stateful regular expression literals with the
  `no-top-level-state` rule.

## [3.5.5] - 2025-08-02

- ([#1582]) Fix reporting of dynamic property accesses that are not at the top
  level.
- ([#1582]) Allow only numeric dynamic property access and unary minus when
  `allowDerived: false`.

## [3.5.4] - 2025-08-02

- ([#1565]) Allow template literals when `allowDerived` is set to true for the
  `no-top-level-side-effects` rule.
- ([#1568]) Restrict unary operators to negative numbers when `allowDerived` for
  the `no-top-level-side-effects` rule.
- ([#1566]) Report shadowing of require in destructuring constructs.
- ([#1566]) Report computed properties in CommonJS export statements when
  `allowDerived: false`.

## [3.5.3] - 2025-06-17

- ([#1506]) Add support for `using` and `await using`.

## [3.5.2] - 2025-05-11

- ([#1474]) Add support for Node.js v24.
- ([#1475]) Add support for member expression in the `allowedCalls` option of
  the `no-top-level-side-effects` rule.

## [3.5.1] - 2025-03-21

- (`f6273f9`) Fix import errors due to missing build files in published package.

## [3.5.0] - 2025-03-19

- (`3f8324e`) Add option to disallow top-level property accesses to
  `no-top-level-side-effects`.
- (`70d1c43`) Add option to allow adding properties to a function declaration at
  the top-level `no-top-level-side-effects`.

## [3.4.1] - 2025-03-16

- (`aaa56b7`) Always allow `ImportExpression`, `SequenceExpression`, and
  `ThisExpression` for `no-top-level-variables`.
- (`a7b41ca`) Allow top-level `WeakMap` and `WeakSet` in recommended config.
- (`7fa587e`) Disallow shadowing `require` in CommonJS.

## [3.4.0] - 2024-07-29

- (`f878f23`) Make `no-top-level-side-effects` report side effects inside
  top-level objects.
- (`9f32d1d`) Make `no-top-level-side-effects` report derived object values
  when `allowDerived: false` (i.e. `{[foo]:42}` and `{...foo}`).
- (`f878f23`) Make `no-top-level-side-effects` stop reporting literals at the
  top level.
- (`5cab9a9`) Automatically determine if analysis should set `commonjs: true`
  for the `no-top-level-side-effects` rule based on ESLint hints (if `commonjs`
  is not explicitly configured).

## [3.3.1] - 2024-07-10

- (`6e1a298`) Allow `"strict mode";` for `no-top-level-side-effects` rule.

## [3.3.0] - 2024-05-09

- (`be6a4af`) Provide a preset strict configuration.

## [3.2.2] - 2024-05-09

- (`e81b7af`) Provide a preset recommended configuration.

## [3.2.1] - 2024-04-30

- (`5ebc009`) Add support for Node.js v22.
- (`bfacef9`) Add usage documentation for new ESLint configuration syntax.

## [3.2.0] - 2024-04-12

- (`8028f58`) Add support for ESLint v9.
- (`38fe16e`) Disallow calling `BigInt` with the `no-top-level-side-effects`
  rule by default.
- (`19d1136`) Add docs metadata to all rules.

## [3.1.0] - 2023-12-29

- (`efdf44f`) Add option to allow deriving values at the top level as a side
  effect.

## [3.0.0] - 2023-12-27

- (`6a79b0c`) _(Breaking)_ Rework the `no-top-level-side-effects` rule to make
  it easier to configure.
- (`207ad89`) _(Breaking)_ Rework the `no-top-level-variables` rule to focus on
  variables being mutable instead of other side effects.

## [2.3.2] - 2024-03-26

- (`16964e0`) Add end-of-life messaging to the documentation.

## [2.3.1] - 2023-12-25

- (`2f2bb41`) Disallow top-level side effects of optional changing for
  `no-top-level-side-effects`.
- (`452f5e3`) Fix bug where `module.exports.property`-like assignments were not
  allowed by `no-top-level-side-effects`.
- (`0e04f54`) Optionally disallow top-level side effect of assigning to either
  of `module.exports` or `exports`.

## [2.3.0] - 2023-12-25

- (`7b50c22`) Disallow top-level side effects of async calls, binary operations,
  conditional expression, logical operations, tagged template expressions, and
  update expressions for `no-top-level-side-effects`.
- (`b83307b`) Disallow top-level unary operations with side effects in
  assignments for `no-top-level-side-effects`.
- (`c2866aa`) Disallow top-level template literals with side effects in
  assignments for `no-top-level-side-effects`.
- (`2458d81`) Fix runtime errors due to export statements.
- (`33120d8`) Optionally disallow top-level side effect of calling `require`.

## [2.2.2] - 2023-12-24

- (`ebf23c6`) Always allow assignment of literals for `no-top-level-variables`.
- (`282ff77`) Optionally allow top-level `const` assignments of functions.
- (`f130b34`) Optionally allow top-level `const` assignments of template
  literals.

## [2.2.1] - 2023-12-24

- (`fced786`) Allow `require()` for `no-top-level-side-effects`.
- (`c46dec9`) Allow `Symbol()` for `const` in `no-top-level-variables`.
- (`8e4566b`) Optionally allow top-level `const` assignments of arrays and
  objects.

## [2.2.0] - 2023-12-24

- (`ba81b6d`) Allow top-level `const` assignment from literals.
- (`bc90491`) Optionally allow `Symbol()` for `no-top-level-side-effects`.
- (`bed2d39`) Report named export declarations for `no-top-level-variables`.
- (`efd1232`) Report function calls in exports for `no-top-level-side-effects`.
- (`cd61a0a`) Report function calls in variable declarations for
  `no-top-level-side-effects`.
- (`fe11de9`) Report `new` calls in export and variable declarations for
  `no-top-level-side-effects`.

## [2.1.0] - 2023-08-06

- (`8a7eb63`) Allow top-level assignments of arrow functions to `const`.
- (`eeb53b4`) Update the license year.

## [2.0.0] - 2023-06-03

- (`c527342`) _(Breaking)_ Drop ESlint v6 and v7 support.
- (`da04330`) _(Breaking)_ Drop Node.js v12, v14, and v16 support.

## [1.0.1] - 2023-04-19

- (`63cfe1e`) Add support for Node.js v20.

## [1.0.0] - 2023-02-25

- (`9ddf3fe`) _(Breaking)_ Rename the rule `no-top-level-side-effect` to
  `no-top-level-side-effects`.
- (`cec69d5`) _(Breaking)_ Report top-level IIFEs by default.
- (`92a3f58`) Improve performance of `no-top-level-variables`.

## [0.3.0] - 2023-01-13

- (`a85b514`) Add support for configuring if top-level Immediately Invoked
  Function Expressions (IIFEs) are allowed for `no-top-level-side-effect`.

## [0.2.3] - 2022-12-31

- (`e97db34`) Report top-level for-in statements.
- (`16462ae`) Report top-level for-of statements.
- (`0a3ba0f`) Report top-level throw statements.
- (`0fb75fa`) Report top-level try statements.
- (`dc5f99e`) Improve performance of `no-top-level-side-effect`.
- (`2e367d4`) Improve violation messaging.

## [0.2.2] - 2022-12-30

- (`64781ae`) Improve performance of `no-top-level-side-effect`.
- (`27d457b`) Report top-level do-while statements.

## [0.2.1] - 2022-12-13

- (`90f9389`) Improve performance of `no-top-level-variables`.
- (`bd334d7`) Make example code in documentation runnable.
- (`9485afb`) Update the license year and fullname.

## [0.2.0] - 2022-11-19

- (`60f0f38`) Add support for configuring allowed assignments to a `const`.
- (`acec27c`) Allow top-level assignments of member expressions to `const`.
- (`ab3fd6b`) Improve performance of `no-top-level-variables`.

## [0.1.3] - 2022-10-31

- (`84b0145`) Add the Security Policy to the published package.
- (`03418df`) Correct the plugin name in the usage documentation text.
- (`6d89129`) Fix only reporting first declaration for `no-top-level-variables`.
- (`ceaa619`) Improve specificity of supported ESLint versions.
- (`73ca9c0`) Improve violation highlights for `no-top-level-variables`.
- (`9fa79df`) Use YAML for example configuration in documentation.

## [0.1.2] - 2022-09-28

- (`6670488`) Add `"exports"` field to the package manifest.
- (`0f80dc5`) Add homepage and repository link to package metadata.
- (`0f80dc5`) Fix supported rules link on npm.
- (`300e7b7`) Improve specificity of supported Node.js versions.

## [0.1.1] - 2022-09-23

- (`e75383f`) Remove unused dependency `requireindex`.
- (`3b42dca`) Remove unused dependency `typescript-eslint/eslint-plugin`.
- (`bb1fd72`) Correct package references in the documentation.

## [0.1.0] - 2022-09-23

- (`9490743`) Don't report top-level literal assignments to a `const`.
- (`d3690da`) Omit unnecessary files from published package.

## [0.0.1] - 2021-11-26

- Initial release.

[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html
[#1474]: https://github.com/ericcornelissen/eslint-plugin-top/pull/1474
[#1475]: https://github.com/ericcornelissen/eslint-plugin-top/pull/1475
[#1506]: https://github.com/ericcornelissen/eslint-plugin-top/pull/1506
[#1565]: https://github.com/ericcornelissen/eslint-plugin-top/pull/1565
[#1566]: https://github.com/ericcornelissen/eslint-plugin-top/pull/1566
[#1568]: https://github.com/ericcornelissen/eslint-plugin-top/pull/1568
[#1582]: https://github.com/ericcornelissen/eslint-plugin-top/pull/1582
[#1603]: https://github.com/ericcornelissen/eslint-plugin-top/pull/1603
[#1774]: https://github.com/ericcornelissen/eslint-plugin-top/pull/1774
