// SPDX-License-Identifier: ISC

import type {Rule} from 'eslint';

const topLevelTypes = [
  'ArrayExpression',
  'AssignmentExpression',
  'BinaryExpression',
  'BlockStatement',
  'CallExpression',
  'ExportNamedDeclaration',
  'ExpressionStatement',
  'LogicalExpression',
  'NewExpression',
  'ObjectExpression',
  'Property',
  'SpreadElement',
  'UnaryExpression',
  'VariableDeclaration',
  'VariableDeclarator'
];

export function IsCommonJs(node: Rule.Node) {
  while (node.type !== 'Program') {
    node = node.parent;
  }
  return node.sourceType === 'script';
}

export function isTopLevel(node: Rule.Node) {
  let scope = node.parent;
  while (topLevelTypes.includes(scope.type)) {
    scope = scope.parent;
  }
  return scope.type === 'Program';
}
