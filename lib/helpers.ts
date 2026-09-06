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
  'Program',
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

export function isCommonJs(node: Rule.Node) {
  return getProgram(node).sourceType === 'script';
}

export function isScript(node: Rule.Node) {
  let scope = node;
  while (scope.parent !== null) {
    scope = scope.parent;
  }

  if (scope.comments.length === 0) {
    return false;
  }

  const [firstComment] = scope.comments;
  return (firstComment.type as string) === 'Shebang';
}

export function isTopLevel(node: Rule.Node) {
  let scope = node.parent;
  while (scope !== null && topLevelTypes.has(scope.type)) {
    scope = scope.parent;
  }
  return scope === null;
}
