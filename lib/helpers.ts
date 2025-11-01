// SPDX-License-Identifier: ISC

import type {Rule} from 'eslint';

const topLevelTypes = new Set([
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
  'TemplateLiteral',
  'UnaryExpression',
  'VariableDeclaration',
  'VariableDeclarator'
]);

export function getProgram(node: Rule.Node) {
  while (node.type !== 'Program') {
    node = node.parent;
  }
  return node;
}

export function IsCommonJs(node: Rule.Node) {
  return getProgram(node).sourceType === 'script';
}

export function isTopLevel(node: Rule.Node) {
  let scope = node.parent;
  while (topLevelTypes.has(scope.type)) {
    scope = scope.parent;
  }
  return scope.type === 'Program';
}
