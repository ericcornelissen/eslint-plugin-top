// Check out rollup.js at: https://rollupjs.org/guide/en/

import typescript from '@rollup/plugin-typescript';

export default {
  input: 'lib/index.ts',
  output: {
    file: 'index.js',
    format: 'cjs'
  },
  plugins: [typescript()]
};
