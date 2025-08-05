<!-- SPDX-License-Identifier: CC0-1.0 -->

# Contributing Guidelines

The `@ericcornelissen/eslint-plugin-top` project welcomes contributions and
corrections of all forms. This includes improvements to the documentation or
code base, new tests, bug fixes, and implementations of new features. We
recommend you open an issue before making any substantial changes so you can be
sure your work won't be rejected. But for small changes, such as fixing a typo,
you can open a Pull Request directly.

If you plan to make a contribution, please do make sure to read through the
relevant sections of this document.

- [Reporting Issues](#reporting-issues)
  - [Security](#security)
  - [Bug Reports](#bug-reports)
  - [Feature Requests](#feature-requests)
  - [Corrections](#corrections)
- [Making Changes](#making-changes)
  - [Prerequisites](#prerequisites)
  - [Workflow](#workflow)
  - [Development Details](#development-details)

---

## Reporting Issues

### Security

For security related issues, please refer to the [security policy].

### Bug Reports

If you have problems with the project or think you've found a bug, please report
it to the developers; we ask you to always open an issue describing the bug as
soon as possible so that we, and others, are aware of the bug.

Before reporting a bug, make sure you've actually found a real bug. Carefully
read the documentation and see if it really says you can do what you're trying
to do. If it's not clear whether you should be able to do something or not,
report that too; it's a bug in the documentation! Also, make sure the bug has
not already been reported.

When preparing to report a bug, try to isolate it to a small working example
that reproduces the problem. Once you have a precise problem you can report it
as a [bug report].

### Feature Requests

The project welcomes request for new rules, extensions of existing rules, or
other new features. When requesting a feature, make sure to be specific and
precise about what you want, as well as why you want it. Also, make sure the
feature has not already been requested.

When you have a clear idea of what you need, you can submit a [feature request].

### Corrections

Corrections, such as fixing typos or refactoring code, are important. For small
changes you can open a Pull Request directly, Or you can first [open an issue].

---

## Making Changes

You are always free to contribute by working on one of the confirmed or accepted
and unassigned [open issues] and opening a Pull Request for it.

It is advised to indicate that you will be working on a issue by commenting on
that issue. This is so others don't start working on the same issue as you are.
Also, don't start working on an issue which someone else is working on - give
everyone a chance to make contributions.

When you open a Pull Request that implements an issue make sure to link to that
issue in the Pull Request description and explain how you implemented the issue
as clearly as possible.

> [!NOTE]
> If you, for whatever reason, can no longer continue your contribution please
> share this in the issue or your Pull Request. This gives others the
> opportunity to work on it. If we don't hear from you for an extended period of
> time we may decide to allow others to work on the issue you were assigned to.

### Prerequisites

To be able to contribute you need the following tooling:

- [git];
- [Node.js] v24.0.0 or higher and [npm] v8.1.2 or higher;
- (Recommended) a code editor with [EditorConfig] support;
- (Optional) [actionlint] (see `.tool-versions` for preferred version);
- (Optional) [ShellCheck] (see `.tool-versions` for preferred version);

### Workflow

If you decide to make a contribution, please do use the following workflow:

- Fork the repository.
- Create a new branch from the latest `main`.
- Make your changes on the new branch.
- Add yourself to the [AUTHORS] list (optional).
- Commit to the new branch and push the commit(s).
- Open a Pull Request against `main`.

### Development Details

Before you start making changes you should run `npm install`. This ensures your
local development environment is setup and ready to go. All code and tests are
written in TypeScript, documentation in Markdown, and scripts using JavaScript.

When making contributions, make sure your changes are [tested](#testing),
[formatted](#formatting), and [analyzed](#analyzing).

#### Formatting

This project uses [Prettier] to format all source code. Run `npm run format` to
automatically update the formatting, or `npm run check:formatting` to check if
the current formatting is correct.

#### Analyzing

On top of that, the project uses static analysis tools to catch mistakes. Use
`npm run check` to run all checks, or use one of the following commands to check
your changes if applicable:

| What          | Command                  | Tool                                |
| :------------ | :----------------------- | :---------------------------------- |
| CI workflows  | `npm run check:ci`       | [actionlint] & [ShellCheck]         |
| JSON          | `npm run check:json`     | [@eslint/json]                      |
| Licenses      | `npm run check:licenses` | [licensee]                          |
| Lockfile      | `npm run check:lockfile` | [lockfile-lint]                     |
| Manifest      | `npm run check:manifest` | [publint]                           |
| MarkDown      | `npm run check:md`       | [markdownlint] & [@eslint/markdown] |
| TypeScript    | `npm run check:ts`       | [@typescript-eslint]                |
| Type coverage | `npm run check:types`    | [type-coverage]                     |
| YAML          | `npm run check:yml`      | [eslint-plugin-yml]                 |

#### Testing

Like the source code, this project's tests are written in TypeScript. [Mocha] is
the testing framework used for all tests.

##### Unit Testing

The unit tests for this project aim to verify the functionality of the plugin is
correct using ESlint's [RuleTester]. The tests can be found in `test/unit` and
can be run using:

```shell
npm run test
```

To get a coverage report for the unit tests, run:

```shell
npm run coverage
```

This will generate a coverage report that can be found in `_reports/coverage`.

###### Mutation Testing

In addition to coverage, the effectiveness of unit tests is also measured using
[mutation testing] with the [Stryker] framework. You can run mutation tests
using:

```shell
npm run mutation
```

This will generate a mutation report that can be found in `_reports/mutation`.

##### Compatibility Testing

The compatibility tests for this project aim to ensure that the plugin is
compatible with all [ESLint] and [Node.js] version it should be compatible with.

To this end, the test suite in `test/compat` runs the plugin using all supported
ESLint versions and compares the output against known snapshots. You can run
this test suite using:

```shell
npm run build
npm run test:compat
```

To check compatibility with all Node.js versions, the continuous integration
runs the compatibility test suite on every supported Node.js version. You can
also do this locally using:

```shell
npm run build
npm run test:compat-all
```

#### Auditing

##### Vulnerabilities

To scan for vulnerabilities in all npm dependencies, run:

```shell
npm run audit:vulnerabilities
```

To scan for vulnerabilities in runtime npm dependencies only, run:

```shell
npm run audit:vulnerabilities:runtime
```

Both use [better-npm-audit] to audit dependencies, which allows for having
exceptions defined in the `.nsprc` file.

##### Deprecations

To scan for deprecation warnings in all npm dependencies, run:

```shell
npm run audit:deprecations
```

To scan for deprecation warnings in runtime npm dependencies only, run:

```shell
npm run audit:deprecations:runtime
```

Both uses [depreman] to audit deprecation warnings, which allows for having
exceptions defined in the `.ndmrc` file.

#### Building

The TypeScript source code of this project is converted to JavaScript for when
the plugin is published to npm. You can do this locally by running:

```shell
npm run build
```

This will create a directory called `dist` (note that this ignored by git).

[@eslint/json]: https://www.npmjs.com/package/@eslint/json
[@eslint/markdown]: https://www.npmjs.com/package/@eslint/markdown
[@typescript-eslint]: https://typescript-eslint.io/
[actionlint]: https://github.com/rhysd/actionlint
[authors]: ./AUTHORS
[better-npm-audit]: https://www.npmjs.com/package/better-npm-audit
[bug report]: https://github.com/ericcornelissen/eslint-plugin-top/issues/new?labels=bug
[depreman]: https://www.npmjs.com/package/depreman
[editorconfig]: https://editorconfig.org/
[eslint]: https://eslint.org/
[eslint-plugin-yml]: https://www.npmjs.com/package/eslint-plugin-yml
[feature request]: https://github.com/ericcornelissen/eslint-plugin-top/issues/new?labels=enhancement
[git]: https://git-scm.com/
[licensee]: https://www.npmjs.com/package/licensee
[lockfile-lint]: https://www.npmjs.com/package/lockfile-lint
[markdownlint]: https://www.npmjs.com/package/markdownlint-cli
[mocha]: https://mochajs.org/
[mutation testing]: https://en.wikipedia.org/wiki/Mutation_testing
[node.js]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/
[open an issue]: https://github.com/ericcornelissen/eslint-plugin-top/issues/new
[open issues]: https://github.com/ericcornelissen/eslint-plugin-top/issues?q=is%3Aissue+is%3Aopen+no%3Aassignee
[prettier]: https://prettier.io/
[publint]: https://www.npmjs.com/package/publint
[ruletester]: https://eslint.org/docs/latest/developer-guide/nodejs-api#ruletester
[security policy]: ./SECURITY.md
[shellcheck]: https://github.com/koalaman/shellcheck
[stryker]: https://stryker-mutator.io/
[type-coverage]: https://www.npmjs.com/package/type-coverage
