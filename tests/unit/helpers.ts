// SPDX-License-Identifier: ISC

import type {RuleTester} from 'eslint';

export function trimTestCases<
  T extends RuleTester.InvalidTestCase | RuleTester.ValidTestCase
>(testCase: T): T {
  return {
    ...testCase,
    code: testCase.code.trim()
  };
}
