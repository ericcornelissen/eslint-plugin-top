// SPDX-License-Identifier: ISC

import * as assert from 'node:assert';
import * as process from 'node:process';

import {runEslint} from './helpers';
import {snapshots} from './snapshots';

const nodeVersion = {
  major: parseInt(process.version.split(/v|\./)[1]),
  minor: parseInt(process.version.split(/v|\./)[2]),
  patch: parseInt(process.version.split(/v|\./)[3])
};
const eslintVersions: ReadonlyArray<number> = [8, 9, 10];

describe('compatibility', function () {
  for (const snapshot of snapshots) {
    describe(snapshot.name, function () {
      for (const eslintVersion of eslintVersions) {
        const run =
          eslintVersion < 10
            ? it
            : nodeVersion.major >= 24
              ? it
              : nodeVersion.major === 22 && nodeVersion.minor >= 13
                ? it
                : nodeVersion.major === 20 && nodeVersion.minor >= 19
                  ? it
                  : it.skip;

        run(`v${eslintVersion}`, function () {
          const {stdout} = runEslint(eslintVersion, snapshot.inp);
          assert.equal(stdout, snapshot.out);
        });
      }
    });
  }
});
