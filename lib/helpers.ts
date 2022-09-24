import {Rule, RuleTester} from 'eslint';

export function isTopLevel(node: Rule.Node) {
  let scope = node.parent;
  while (scope.type === 'BlockStatement') {
    scope = scope.parent;
  }
  return scope.type === 'Program';
}

export function trimTestCases<
  T extends RuleTester.InvalidTestCase | RuleTester.ValidTestCase
>(testCase: T): T {
  return {
    ...testCase,
    code: testCase.code.trim()
  };
}
