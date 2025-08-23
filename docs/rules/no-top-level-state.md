<!-- SPDX-License-Identifier: CC-BY-4.0 -->

# No top level state (no-top-level-state)

Disallow top level state.

State at the top level indicates side effects because if used by functions or
methods their behavior may change over time. This is not always problematic
(e.g. a cache) but should be used sparingly and intentionally.

## Rule Details

This rule lets you control top level state. For to historical reasons, some of
this is managed by the [`no-top-level-variables` rule] instead. To avoid top
level state make sure to configure both rules.

Examples of **incorrect** code for this rule:

```javascript
const glob = /foobar/g; // The 'g' flag makes the regular expression stateful
const stic = /foobar/y; // The 'y' flag makes the regular expression stateful
```

Examples of **correct** code for this rule:

```javascript
const regexp = /foobar/;
```

### Options

This rule does not have any configuration.

## When Not To Use It

If you want to allow top level state.

---

Please [open an issue] if you found a mistake or if you have a suggestion for
how to improve the documentation.

[open an issue]: https://github.com/ericcornelissen/eslint-plugin-top/issues/new?labels=documentation&template=documentation.md
[`no-top-level-variables` rule]: ./no-top-level-variables.md
