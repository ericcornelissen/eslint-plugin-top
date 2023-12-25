// SPDX-License-Identifier: ISC

interface Snapshot {
  readonly name: string;
  readonly inp: string;
  readonly out: string;
}

export const snapshots: ReadonlyArray<Snapshot> = [
  {
    name: 'with no-top-level-variables violations',
    inp: 'const foo = ["bar"];var hello = ["world", "!"];',
    out: `
<text>
  1:7   error  Variables at the top level are not allowed  @ericcornelissen/top/no-top-level-variables
  1:21  error  Use of var at the top level is not allowed  @ericcornelissen/top/no-top-level-variables

✖ 2 problems (2 errors, 0 warnings)

`
  },
  {
    name: 'with top-level-side-effect violation',
    inp: 'console.log("hello world");',
    out: `
<text>
  1:1  error  Side effects at the top level are not allowed  @ericcornelissen/top/no-top-level-side-effects

✖ 1 problem (1 error, 0 warnings)

`
  },
  {
    name: 'no violations',
    inp: 'function foobar() { var foo = "bar"; }',
    out: ''
  }
];
