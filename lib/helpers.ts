import type {Rule} from 'eslint';

export function isTopLevel(node: Rule.Node) {
  let scope = node.parent;
  while (scope.type === 'BlockStatement') {
    scope = scope.parent;
  }
  return scope.type === 'Program';
}
