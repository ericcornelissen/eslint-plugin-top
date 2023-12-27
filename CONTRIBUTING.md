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

> [!NOTE]
> If you want to make a contribution to v2 of the project, please refer to the
> [Contributing Guidelines for v2].

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
- [Node.js] v20.0.0 or higher and [npm] v8.1.2 or higher;
- (Recommended) a code editor with [EditorConfig] support;
- (Optional) [actionlint] (see `.tool-versions` for preferred version);
- (Optional) [ShellCheck] (see `.tool-versions` for preferred version);

### Workflow

If you decide to make a contribution, please do use the following workflow:

- Fork the repository.
- Create a new branch from the latest `main`.
- Make your changes on the new branch.
- Commit to the new branch and push the commit(s).
- Open a Pull Request against `main`.

### Development Details

Before you start making changes you should run `npm install`. This ensures your
local development environment is setup and ready to go. All code and tests are
written in TypeScript, documentation in Markdown, and scripts using JavaScript.

When making contributions, make sure your changes are [tested](#testing),
[well-formatted](#formatting-and-linting), and [vetted](#vetting).

#### Formatting and Linting

This project uses [Prettier] to format all source code. Run `npm run format` to
automatically update the formatting, or `npm run format:check` to check if the
current formatting is correct.

On top of that, this project uses linters to catch mistakes. Use the following
command to check your changes if applicable:

| File type          | Command             | Linter                      |
| :----------------- | :------------------ | :-------------------------- |
| CI workflows       | `npm run lint:ci`   | [actionlint] & [ShellCheck] |
| JSON (`.json`)     | `npm run lint:json` | [eslint-plugin-json]        |
| MarkDown (`.md`)   | `npm run lint:md`   | [markdownlint]              |
| TypeScript (`.ts`) | `npm run lint:ts`   | [ESLint]                    |
| YAML (`.yml`)      | `npm run lint:yml`  | [eslint-plugin-yml]         |

#### Vetting

The project is vetted using a small collection of static analysis tools. Run
`npm run vet` to analyze the project for potential problems.

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
npm run test:mutation
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
npm run audit
```

To scan for vulnerabilities in runtime npm dependencies only, run:

```shell
npm run audit:runtime
```

Both use [better-npm-audit] to audit dependencies, which allows for having
exceptions defined in the `.nsprc` file.

##### Licenses

To check the licenses of Node.js dependencies for potential problems this
project uses [licensee]. To validate the project dependencies' licenses, run:

```shell
npm run license-check
```

#### Building

The TypeScript source code of this project is converted and bundled into a
single JavaScript file using [rollup.js] when the plugin is published to npm.
You can do this locally by running:

```shell
npm run build
```

This will create a file called `index.js`. Note that this file ignored by git.

[actionlint]: https://github.com/rhysd/actionlint
[better-npm-audit]: https://www.npmjs.com/package/better-npm-audit
[bug report]: https://github.com/ericcornelissen/eslint-plugin-top/issues/new?labels=bug
[contributing guidelines for v2]: https://github.com/ericcornelissen/eslint-plugin-top/blob/main-v2/CONTRIBUTING.md
[editorconfig]: https://editorconfig.org/
[eslint]: https://eslint.org/
[eslint-plugin-json]: https://www.npmjs.com/package/eslint-plugin-json
[eslint-plugin-yml]: https://www.npmjs.com/package/eslint-plugin-yml
[feature request]: https://github.com/ericcornelissen/eslint-plugin-top/issues/new?labels=enhancement
[git]: https://git-scm.com/
[licensee]: https://github.com/jslicense/licensee.js
[markdownlint]: https://github.com/DavidAnson/markdownlint
[mocha]: https://mochajs.org/
[mutation testing]: https://en.wikipedia.org/wiki/Mutation_testing
[node.js]: https://nodejs.org/en/
[npm]: https://www.npmjs.com/
[open an issue]: https://github.com/ericcornelissen/eslint-plugin-top/issues/new
[open issues]: https://github.com/ericcornelissen/eslint-plugin-top/issues?q=is%3Aissue+is%3Aopen+no%3Aassignee
[prettier]: https://prettier.io/
[rollup.js]: https://rollupjs.org/guide/en/
[ruletester]: https://eslint.org/docs/latest/developer-guide/nodejs-api#ruletester
[security policy]: ./SECURITY.md
[shellcheck]: https://github.com/koalaman/shellcheck
[stryker]: https://stryker-mutator.io/
