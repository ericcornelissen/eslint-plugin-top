import type {Rule} from 'eslint';
import type {ExpressionStatement} from 'estree';

import {isTopLevel} from '../helpers';

const violationMessage = 'Side effects in toplevel are not allowed';

function sideEffect(context: Rule.RuleContext) {
  return (node: Rule.Node) => {
    if (isTopLevel(node)) {
      context.report({
        node,
        messageId: 'message'
      });
    }
  };
}

function isExportsAssignment(node: ExpressionStatement): boolean {
  return (
    node.expression.type === 'AssignmentExpression' &&
    node.expression.left.type === 'Identifier' &&
    node.expression.left.name === 'exports'
  );
}

function isExportPropertyAssignment(node: ExpressionStatement): boolean {
  return (
    node.expression.type === 'AssignmentExpression' &&
    node.expression.left.type === 'MemberExpression' &&
    node.expression.left.object.type === 'Identifier' &&
    node.expression.left.object.name === 'exports'
  );
}

function isIIFE(node: ExpressionStatement): boolean {
  return (
    node.expression.type === 'CallExpression' &&
    node.expression.callee &&
    (node.expression.callee.type === 'ArrowFunctionExpression' ||
      node.expression.callee.type === 'FunctionExpression')
  );
}

function isModuleAssignment(node: ExpressionStatement): boolean {
  return (
    node.expression.type === 'AssignmentExpression' &&
    node.expression.left.type === 'MemberExpression' &&
    node.expression.left.object.type === 'Identifier' &&
    node.expression.left.object.name === 'module'
  );
}

export const noTopLevelSideEffect: Rule.RuleModule = {
  meta: {
    type: 'problem',
    messages: {
      message: violationMessage
    }
  },
  create: (context) => {
    return {
      ExpressionStatement: (node) => {
        if (isTopLevel(node)) {
          if (isExportsAssignment(node)) return;
          if (isExportPropertyAssignment(node)) return;
          if (isIIFE(node)) return;
          if (isModuleAssignment(node)) return;

          context.report({
            node,
            messageId: 'message'
          });
        }
      },
      IfStatement: sideEffect(context),
      ForStatement: sideEffect(context),
      WhileStatement: sideEffect(context),
      SwitchStatement: sideEffect(context)
    };
  }
};
