export const noTopLevelVariablesViolation = {
  inp: 'var foo = "bar";',
  out: `
<text>
  1:5  error  Unexpected variable at the top level  @ericcornelissen/top/no-top-level-variables

✖ 1 problem (1 error, 0 warnings)

`
};

export const noTopLevelSideEffectsViolation = {
  inp: 'console.log("hello world");',
  out: `
<text>
  1:1  error  Side effects in toplevel are not allowed  @ericcornelissen/top/no-top-level-side-effect

✖ 1 problem (1 error, 0 warnings)

`
};

export const noViolations = {
  inp: 'function foobar() { var foo = "bar"; }',
  out: ''
};
