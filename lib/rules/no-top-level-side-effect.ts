import type {Rule} from 'eslint';
import type {ExpressionStatement} from 'estree';

import {isTopLevel} from '../helpers';

const violationMessage = 'Side effects at the top level are not allowed';

function ifTopLevelReportWith(context: Rule.RuleContext) {
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
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowIIFE: {
            type: 'boolean'
          }
        }
      }
    ]
  },
  create: (context) => {
    const providedAllowIIFE: boolean | null = context.options[0]?.allowIIFE;

    const options: {
      readonly allowIIFE: boolean;
    } = {
      allowIIFE:
        typeof providedAllowIIFE === 'boolean' ? providedAllowIIFE : true
    };

    return {
      ExpressionStatement: (node) => {
        if (isTopLevel(node)) {
          if (isIIFE(node)) {
            if (!options.allowIIFE) {
              context.report({
                node,
                messageId: 'message'
              });
            }
          } else if (
            !isExportsAssignment(node) &&
            !isExportPropertyAssignment(node) &&
            !isModuleAssignment(node)
          ) {
            context.report({
              node,
              messageId: 'message'
            });
          }
        }
      },
      IfStatement: ifTopLevelReportWith(context),
      ForStatement: ifTopLevelReportWith(context),
      ForInStatement: ifTopLevelReportWith(context),
      ForOfStatement: ifTopLevelReportWith(context),
      WhileStatement: ifTopLevelReportWith(context),
      DoWhileStatement: ifTopLevelReportWith(context),
      SwitchStatement: ifTopLevelReportWith(context),
      ThrowStatement: ifTopLevelReportWith(context),
      TryStatement: ifTopLevelReportWith(context)
    };
  }
};
