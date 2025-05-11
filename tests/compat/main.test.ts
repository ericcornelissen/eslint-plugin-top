// SPDX-License-Identifier: ISC

import * as assert from 'node:assert';

import { runEslint } from './helpers';
import { snapshots } from './snapshots';

const eslintVersions: ReadonlyArray<number> = [8, 9];

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
