// Check out rollup.js at: https://rollupjs.org/guide/en/

const typescript = require('@rollup/plugin-typescript');

module.exports = {
  input: 'lib/index.ts',
  output: {
    file: 'index.js',
    format: 'cjs'
  },
  plugins: [typescript({module: 'NodeNext', moduleResolution: 'NodeNext'})]
};
