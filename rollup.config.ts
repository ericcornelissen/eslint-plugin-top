// Check out rollup.js at: https://rollupjs.org/guide/en/

import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'lib/index.ts',
  output: {
    file: 'index.js',
    format: 'cjs'
  },
  plugins: [
    typescript(),
    resolve({
      extensions: ['.js', '.ts']
    })
  ]
};
