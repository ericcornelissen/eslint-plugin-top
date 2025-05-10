// SPDX-License-Identifier: ISC

const cp = require('node:child_process');
const path = require('node:path');

module.exports.runEslint = function(version, snippet) {
  const projectRoot = path.resolve('.');
  const nodeModules = path.resolve(projectRoot, 'node_modules');
  const eslintCli = {
    8: path.resolve(nodeModules, 'eslint-v8', 'bin', 'eslint.js'),
    9: path.resolve(nodeModules, 'eslint-v9', 'bin', 'eslint.js')
  }[version];

  if (!eslintCli) {
    throw new Error(`Unknown ESLint version ${version}`);
  }

  return cp.spawnSync(
    'node',
    [
      eslintCli,
      // Avoid interference from a local ESLint configuration file
      version <= 8 ? '--no-eslintrc' : '--no-config-lookup',
      // Lint from stdin
      '--stdin',
      // Allow modern (ES6) syntax
      ...(version <= 8 ? ['--env', 'es6'] : []),
      // Configure this plugin
      '--plugin',
      '@ericcornelissen/top',
      '--rule',
      '@ericcornelissen/top/no-top-level-variables: error',
      '--rule',
      '@ericcornelissen/top/no-top-level-side-effects: error'
    ],
    {
      encoding: 'utf-8',
      // Provide stdin
      input: snippet
    }
  );
}
