import * as assert from 'node:assert';
import * as cp from 'node:child_process';
import * as path from 'node:path';

import * as snapshots from './snapshots';

describe('compatibility', function () {
  describe('without violations', function () {
    const snippet = "function foobar() { var foo = 'bar'; }";

    it('v6', function () {
      const {exitCode, stdout} = runEslint(6, snippet);
      assert.equal(exitCode, 0);
      assert.equal(stdout, snapshots.noViolations);
    });

    it('v7', function () {
      const {exitCode, stdout} = runEslint(7, snippet);
      assert.equal(exitCode, 0);
      assert.equal(stdout, snapshots.noViolations);
    });

    it('v8', function () {
      const {exitCode, stdout} = runEslint(8, snippet);
      assert.equal(exitCode, 0);
      assert.equal(stdout, snapshots.noViolations);
    });
  });

  describe('with top-level-variable violation', function () {
    const snippet = "var foo = 'bar';";

    it('v6', function () {
      const {exitCode, stdout} = runEslint(6, snippet);
      assert.equal(exitCode, 1);
      assert.equal(stdout, snapshots.noTopLevelVariablesViolation);
    });

    it('v7', function () {
      const {exitCode, stdout} = runEslint(7, snippet);
      assert.equal(exitCode, 1);
      assert.equal(stdout, snapshots.noTopLevelVariablesViolation);
    });

    it('v8', function () {
      const {exitCode, stdout} = runEslint(8, snippet);
      assert.equal(exitCode, 1);
      assert.equal(stdout, snapshots.noTopLevelVariablesViolation);
    });
  });

  describe('with top-level-side-effect violation', function () {
    const snippet = "console.log('hello world');";

    it('v6', function () {
      const {exitCode, stdout} = runEslint(6, snippet);
      assert.equal(exitCode, 1);
      assert.equal(stdout, snapshots.noTopLevelSideEffectsViolation);
    });

    it('v7', function () {
      const {exitCode, stdout} = runEslint(7, snippet);
      assert.equal(exitCode, 1);
      assert.equal(stdout, snapshots.noTopLevelSideEffectsViolation);
    });

    it('v8', function () {
      const {exitCode, stdout} = runEslint(8, snippet);
      assert.equal(exitCode, 1);
      assert.equal(stdout, snapshots.noTopLevelSideEffectsViolation);
    });
  });
});

function runEslint(
  version: 6 | 7 | 8,
  snippet: string
): {exitCode: number | null; stdout: string} {
  const projectRoot = path.resolve('.');
  const nodeModules = path.resolve(projectRoot, 'node_modules');
  const eslintClis = {
    6: path.resolve(nodeModules, 'eslint-v6', 'bin', 'eslint.js'),
    7: path.resolve(nodeModules, 'eslint-v7', 'bin', 'eslint.js'),
    8: path.resolve(nodeModules, 'eslint-v8', 'bin', 'eslint.js')
  };

  const {status, stdout} = cp.spawnSync(
    'node',
    [
      eslintClis[version],
      // Avoid interference from a local ESLint configuration file
      '--no-eslintrc',
      // Lint from stdin
      '--stdin',
      // Configure this plugin
      '--plugin',
      '@ericcornelissen/top',
      '--rule',
      '@ericcornelissen/top/no-top-level-variables: error',
      '--rule',
      '@ericcornelissen/top/no-top-level-side-effect: error'
    ],
    {
      encoding: 'utf-8',
      // Provide stdin
      input: snippet
    }
  );

  return {exitCode: status, stdout};
}
