// SPDX-License-Identifier: ISC

interface Snapshot {
  readonly name: string;
  readonly inp: string;
  readonly out: string;
}

export const snapshots: ReadonlyArray<Snapshot> = [
  {
    name: 'with no-top-level-side-effects violation',
    inp: 'console.log("hello world");',
    out: `
<text>
  1:1  error  Side effects at the top level are not allowed  @ericcornelissen/top/no-top-level-side-effects

✖ 1 problem (1 error, 0 warnings)

`
  },
  {
    name: 'with no-top-level-state violation',
    inp: 'const regexp = /foobar/g;',
    out: `
<text>
  1:16  error  Regular expressions with the \`g\` or \`y\` flag are stateful and not allowed at the top level  @ericcornelissen/top/no-top-level-state

✖ 1 problem (1 error, 0 warnings)

`
  },
  {
    name: 'with no-top-level-variables violations',
    inp: 'const foo = ["bar"];var hello = ["world", "!"];',
    out: `
<text>
  1:7   error  Variables at the top level are not allowed    @ericcornelissen/top/no-top-level-variables
  1:21  error  Use of 'var' at the top level is not allowed  @ericcornelissen/top/no-top-level-variables

✖ 2 problems (2 errors, 0 warnings)

`
  },
  {
    name: 'no violations',
    inp: 'function foobar() { var foo = "bar"; }',
    out: ''
  }
];
