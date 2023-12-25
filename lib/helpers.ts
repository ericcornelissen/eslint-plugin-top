// SPDX-License-Identifier: ISC

import type {Rule} from 'eslint';
import type {Expression} from 'estree';

export function isRequireCall(
  expression: Expression | null | undefined
): boolean {
  return (
    expression?.type === 'CallExpression' &&
    expression.callee.type === 'Identifier' &&
    expression.callee.name === 'require'
  );
}

export function isSymbolCall(expression: Expression): boolean {
  return (
    expression.type === 'CallExpression' &&
    expression.callee.type === 'Identifier' &&
    expression.callee.name === 'Symbol'
  );
}

export function isTopLevel(node: Rule.Node) {
  let scope = node.parent;
  while (scope.type === 'BlockStatement') {
    scope = scope.parent;
  }
  return scope.type === 'Program';
}
