// Check out rollup.js at: https://rollupjs.org/guide/en/

import typescript from '@rollup/plugin-typescript';

export default {
  input: 'lib/index.ts',
  output: {
    file: 'index.cjs',
    format: 'cjs'
  },
  plugins: [typescript({module: undefined, moduleResolution: undefined})]
};
