// SPDX-License-Identifier: ISC

import type {Rule} from 'eslint';
import type {
  CallExpression,
  ExpressionStatement,
  Expression,
  NewExpression,
  VariableDeclaration
} from 'estree';

import {isTopLevel} from '../helpers';

type Options = {
  readonly allowedCalls: ReadonlyArray<string>;
  readonly allowedNews: ReadonlyArray<string>;
  readonly allowIIFE: boolean;
};

const disallowedSideEffect = {
  id: '0',
  message: 'Side effects at the top level are not allowed'
};

const defaultAllowedCalls = ['BigInt', 'Symbol'];
const defaultAllowedNews: string[] = [];

function ifTopLevelReportWith(context: Rule.RuleContext) {
  return (node: Rule.Node) => {
    if (isTopLevel(node)) {
      context.report({
        node,
        messageId: disallowedSideEffect.id
      });
    }
  };
}

function isCallTo(expression: CallExpression, name: string): boolean {
  return (
    expression.callee.type === 'Identifier' && expression.callee.name === name
  );
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

function isNew(expression: NewExpression, name: string): boolean {
  return (
    expression.callee.type === 'Identifier' && expression.callee.name === name
  );
}

function sideEffectInExpression(
  context: Rule.RuleContext,
  options: Options,
  expression: Expression
) {
  if (
    expression.type === 'AwaitExpression' ||
    expression.type === 'BinaryExpression' ||
    (expression.type === 'CallExpression' &&
      !options.allowedCalls.some((name) => isCallTo(expression, name))) ||
    expression.type === 'ChainExpression' ||
    expression.type === 'ConditionalExpression' ||
    (expression.type === 'NewExpression' &&
      !options.allowedNews.some((name) => isNew(expression, name))) ||
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
      messageId: disallowedSideEffect.id
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
      [disallowedSideEffect.id]: disallowedSideEffect.message
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowedCalls: {
            type: 'array',
            minItems: 0
          },
          allowedNews: {
            type: 'array',
            minItems: 0
          },
          allowIIFE: {
            type: 'boolean'
          },
          commonjs: {
            type: 'boolean'
          }
        }
      }
    ]
  },
  create: (context) => {
    // type-coverage:ignore-next-line
    const commonjs: boolean | null = context.options[0]?.commonjs;
    // type-coverage:ignore-next-line
    const providedAllowIIFE: boolean | null = context.options[0]?.allowIIFE;

    const options: Options = {
      allowedCalls: [
        ...(commonjs ? ['require'] : new Set()),
        // type-coverage:ignore-next-line
        ...(context.options[0]?.allowedCalls || defaultAllowedCalls)
      ],
      // type-coverage:ignore-next-line
      allowedNews: context.options[0]?.allowedNews || defaultAllowedNews,
      allowIIFE:
        typeof providedAllowIIFE === 'boolean' ? providedAllowIIFE : false
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
              messageId: disallowedSideEffect.id
            });
          }
        } else if (
          commonjs &&
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
            messageId: disallowedSideEffect.id
          });
        }
      },
      VariableDeclaration: (node) => {
        if (isTopLevel(node)) {
          sideEffectsInVariableDeclaration(context, options, node);
        }
      },

      DoWhileStatement: ifTopLevelReportWith(context),
      ForInStatement: ifTopLevelReportWith(context),
      ForOfStatement: ifTopLevelReportWith(context),
      ForStatement: ifTopLevelReportWith(context),
      IfStatement: ifTopLevelReportWith(context),
      SwitchStatement: ifTopLevelReportWith(context),
      ThrowStatement: ifTopLevelReportWith(context),
      TryStatement: ifTopLevelReportWith(context),
      WhileStatement: ifTopLevelReportWith(context)
    };
  }
};
