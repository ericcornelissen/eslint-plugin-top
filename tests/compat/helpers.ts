// SPDX-License-Identifier: ISC

import * as cp from 'node:child_process';
import * as path from 'node:path';

export function runEslint(version: number, snippet: string): {stdout: string} {
  const projectRoot = path.resolve('.');
  const nodeModules = path.resolve(projectRoot, 'node_modules');
  const eslintCli = {
    8: path.resolve(nodeModules, 'eslint-v8', 'bin', 'eslint.js'),
    9: path.resolve(nodeModules, 'eslint-v9', 'bin', 'eslint.js'),
    10: path.resolve(nodeModules, 'eslint-v10', 'bin', 'eslint.js')
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
      '@ericcornelissen/top/no-top-level-side-effects: error',
      '--rule',
      '@ericcornelissen/top/no-top-level-state: error',
      '--rule',
      '@ericcornelissen/top/no-top-level-variables: error'
    ],
    {
      encoding: 'utf-8',
      input: snippet
    }
  );
}
