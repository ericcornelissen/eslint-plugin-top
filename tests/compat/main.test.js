// SPDX-License-Identifier: ISC

const assert = require( 'node:assert');

const {runEslint} = require( './helpers');
const {snapshots} = require( './snapshots');

const eslintVersions = [8, 9];

describe('compatibility', function () {
  for (const snapshot of snapshots) {
    describe(snapshot.name, function () {
      for (const eslintVersion of eslintVersions) {
        it(`v${eslintVersion}`, function () {
          const {stdout} = runEslint(eslintVersion, snapshot.inp);
          assert.equal(stdout, snapshot.out);
        });
      }
    });
  }
});
