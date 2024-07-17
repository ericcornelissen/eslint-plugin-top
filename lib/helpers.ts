// SPDX-License-Identifier: ISC

import type {Rule} from 'eslint';

export function IsCommonJs(node: Rule.Node) {
  while (node.type !== 'Program') {
    node = node.parent;
  }
  return node.sourceType === 'script';
}

export function isTopLevel(node: Rule.Node) {
  let scope = node.parent;
  while (scope.type === 'BlockStatement') {
    scope = scope.parent;
  }
  return scope.type === 'Program';
}
