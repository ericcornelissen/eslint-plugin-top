// SPDX-License-Identifier: ISC

import type {Rule} from 'eslint';
import type {
  ExpressionStatement,
  Expression,
  VariableDeclaration
} from 'estree';

import {isRequireCall, isSymbolCall, isTopLevel} from '../helpers';

type Options = {
  readonly allowExports: boolean;
  readonly allowIIFE: boolean;
  readonly allowRequire: boolean;
  readonly allowSymbol: boolean;
};

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

function isModulePropertyAssignment(node: ExpressionStatement): boolean {
  return (
    node.expression.type === 'AssignmentExpression' &&
    node.expression.left.type === 'MemberExpression' &&
    node.expression.left.object.type === 'MemberExpression' &&
    node.expression.left.object.object.type === 'Identifier' &&
    node.expression.left.object.object.name === 'module' &&
    node.expression.left.object.property.type === 'Identifier' &&
    node.expression.left.object.property.name === 'exports'
  );
}

function sideEffectInExpression(
  context: Rule.RuleContext,
  options: Options,
  expression: Expression
) {
  if (
    (options.allowRequire && isRequireCall(expression)) ||
    (options.allowSymbol && isSymbolCall(expression))
  ) {
    return;
  }

  if (
    expression.type === 'AwaitExpression' ||
    expression.type === 'BinaryExpression' ||
    expression.type === 'CallExpression' ||
    expression.type === 'ChainExpression' ||
    expression.type === 'ConditionalExpression' ||
    expression.type === 'NewExpression' ||
    expression.type === 'LogicalExpression' ||
    expression.type === 'TaggedTemplateExpression' ||
    (expression.type === 'TemplateLiteral' &&
      expression.expressions.length > 0) ||
    (expression.type === 'UnaryExpression' &&
      expression.argument.type !== 'Literal') ||
    expression.type === 'UpdateExpression'
  ) {
    context.report({
      node: expression,
      messageId: 'message'
    });
  }
}

function sideEffectsInVariableDeclaration(
  context: Rule.RuleContext,
  options: Options,
  node: VariableDeclaration
) {
  for (const declaration of node.declarations) {
    const expression = declaration.init;
    if (expression !== null && expression !== undefined) {
      sideEffectInExpression(context, options, expression);
    }
  }
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
          allowModuleExports: {
            type: 'boolean'
          },
          allowIIFE: {
            type: 'boolean'
          },
          allowRequire: {
            type: 'boolean'
          },
          allowSymbol: {
            type: 'boolean'
          }
        }
      }
    ]
  },
  create: (context) => {
    // type-coverage:ignore-next-line
    const [provided] = context.options;

    // type-coverage:ignore-next-line
    const providedAllowExports: boolean | null = provided?.allowModuleExports;
    // type-coverage:ignore-next-line
    const providedAllowIIFE: boolean | null = provided?.allowIIFE;
    // type-coverage:ignore-next-line
    const providedAllowRequire: boolean | null = provided?.allowRequire;
    // type-coverage:ignore-next-line
    const providedAllowSymbol: boolean | null = provided?.allowSymbol;

    const options: Options = {
      allowExports:
        typeof providedAllowExports === 'boolean' ? providedAllowExports : true,
      allowIIFE:
        typeof providedAllowIIFE === 'boolean' ? providedAllowIIFE : false,
      allowRequire:
        typeof providedAllowRequire === 'boolean' ? providedAllowRequire : true,
      allowSymbol:
        typeof providedAllowSymbol === 'boolean' ? providedAllowSymbol : true
    };

    return {
      ExportNamedDeclaration: (node) => {
        if (node.declaration?.type === 'VariableDeclaration') {
          sideEffectsInVariableDeclaration(context, options, node.declaration);
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
          options.allowExports &&
          (isExportsAssignment(node) ||
            isExportPropertyAssignment(node) ||
            isModuleAssignment(node) ||
            isModulePropertyAssignment(node))
        ) {
          if (node.expression.type === 'AssignmentExpression') {
            sideEffectInExpression(context, options, node.expression.right);
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
      TryStatement: ifTopLevelReportWith(context),
      VariableDeclaration: (node) => {
        if (isTopLevel(node)) {
          sideEffectsInVariableDeclaration(context, options, node);
        }
      }
    };
  }
};
