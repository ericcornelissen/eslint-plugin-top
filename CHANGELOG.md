# Changelog

All notable changes to `@ericcornelissen/eslint-plugin-top` will be documented
in this file.

The format is based on [Keep a Changelog], and this project adheres to [Semantic
Versioning].

## [Unreleased]

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
