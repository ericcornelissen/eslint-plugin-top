// SPDX-License-Identifier: ISC

import type {AST, Rule} from 'eslint';

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

export function getProgram(node: Rule.Node): AST.Program {
  while (node.type !== 'Program') {
    node = node.parent;
  }
  return node;
}

export function isCommonJs(node: Rule.Node): boolean {
  return getProgram(node).sourceType === 'script';
}

export function isTopLevel(node: Rule.Node): boolean {
  let scope = node.parent;
  while (scope !== null && topLevelTypes.has(scope.type)) {
    scope = scope.parent;
  }
  return scope === null;
}
