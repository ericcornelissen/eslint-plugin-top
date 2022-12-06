import {Rule} from 'eslint';
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
          const isIIFE = Boolean(
            node.expression.type === 'CallExpression' &&
              node.expression.callee &&
              (node.expression.callee.type === 'ArrowFunctionExpression' ||
                node.expression.callee.type === 'FunctionExpression')
          );

          const isModuleAssignment =
            node.expression.type === 'AssignmentExpression' &&
            node.expression.left.type === 'MemberExpression' &&
            node.expression.left.object.type === 'Identifier' &&
            node.expression.left.object.name === 'module';
          const isExportsAssignment =
            node.expression.type === 'AssignmentExpression' &&
            node.expression.left.type === 'Identifier' &&
            node.expression.left.name === 'exports';
          const isExportPropertyAssignment =
            node.expression.type === 'AssignmentExpression' &&
            node.expression.left.type === 'MemberExpression' &&
            node.expression.left.object.type === 'Identifier' &&
            node.expression.left.object.name === 'exports';

          if (
            !isIIFE &&
            !isModuleAssignment &&
            !isExportsAssignment &&
            !isExportPropertyAssignment
          ) {
            context.report({
              node,
              messageId: 'message'
            });
          }
        }
      },
      IfStatement: sideEffect(context),
      ForStatement: sideEffect(context),
      WhileStatement: sideEffect(context),
      SwitchStatement: sideEffect(context)
    };
  }
};
