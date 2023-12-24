// SPDX-License-Identifier: ISC

import type {Rule} from 'eslint';
import type {Declaration, ExpressionStatement, Expression} from 'estree';

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

function isAllowedExpression(expression: Expression) {
  return expression.type !== 'CallExpression';
}

export const noTopLevelSideEffects: Rule.RuleModule = {
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
    // type-coverage:ignore-next-line
    const providedAllowIIFE: boolean | null = context.options[0]?.allowIIFE;

    const options: {
      readonly allowIIFE: boolean;
    } = {
      allowIIFE:
        typeof providedAllowIIFE === 'boolean' ? providedAllowIIFE : false
    };

    return {
      ExportNamedDeclaration: (node) => {
        // type-coverage:ignore-next-line
        const exportDeclaration = node.declaration as Declaration;
        if (exportDeclaration.type === 'VariableDeclaration') {
          for (const declaration of exportDeclaration.declarations) {
            const expression = declaration.init;
            if (expression !== null && expression !== undefined) {
              if (!isAllowedExpression(expression)) {
                context.report({
                  node: expression,
                  messageId: 'message'
                });
              }
            }
          }
        }
      },
      ExpressionStatement: (node) => {
        if (!isTopLevel(node)) {
          return;
        }

        if (isIIFE(node)) {
          if (!options.allowIIFE) {
            context.report({
              node,
              messageId: 'message'
            });
          }
        } else if (
          isExportsAssignment(node) ||
          isExportPropertyAssignment(node) ||
          isModuleAssignment(node)
        ) {
          if (node.expression.type === 'AssignmentExpression') {
            if (!isAllowedExpression(node.expression.right)) {
              context.report({
                node: node.expression.right,
                messageId: 'message'
              });
            }
          }
        } else {
          context.report({
            node,
            messageId: 'message'
          });
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
