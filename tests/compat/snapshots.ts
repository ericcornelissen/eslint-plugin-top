interface Snapshot {
  readonly name: string;
  readonly inp: string;
  readonly out: string;
}

export const snapshots: ReadonlyArray<Snapshot> = [
  {
    name: 'with top-level-variables violation',
    inp: 'var foo = "bar";',
    out: `
<text>
  1:5  error  Unexpected variable at the top level  @ericcornelissen/top/no-top-level-variables

✖ 1 problem (1 error, 0 warnings)

`
  },
  {
    name: 'with top-level-side-effect violation',
    inp: 'console.log("hello world");',
    out: `
<text>
  1:1  error  Side effects in toplevel are not allowed  @ericcornelissen/top/no-top-level-side-effect

✖ 1 problem (1 error, 0 warnings)

`
  },
  {
    name: 'no violations',
    inp: 'function foobar() { var foo = "bar"; }',
    out: ''
  }
];
