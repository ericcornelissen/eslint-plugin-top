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
  readonly allowDerived: boolean;
  readonly commonjs: boolean;
};

const allowedCallsOption = {
  default: ['Symbol']
};
const allowedNewsOption = {
  default: []
};

const disallowedSideEffect = {
  id: '0',
  message: 'Side effects at the top level are not allowed'
};

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

function checkExpression(
  context: Rule.RuleContext,
  options: Options,
  expression: Expression
) {
  const report = () => {
    context.report({
      node: expression,
      messageId: disallowedSideEffect.id
    });
  };

  switch (expression.type) {
    case 'AwaitExpression':
    case 'ChainExpression':
    case 'ConditionalExpression':
    case 'TaggedTemplateExpression':
    case 'UpdateExpression':
      report();
      break;

    case 'BinaryExpression':
    case 'LogicalExpression':
      if (options.allowDerived) {
        checkExpression(context, options, expression.left);
        checkExpression(context, options, expression.right);
        return;
      }

      report();
      break;

    case 'CallExpression':
      if (options.allowedCalls.some((name) => isCallTo(expression, name))) {
        return;
      }

      report();
      break;
    case 'NewExpression':
      if (options.allowedNews.some((name) => isNew(expression, name))) {
        return;
      }

      report();
      break;

    case 'TemplateLiteral':
      if (expression.expressions.length === 0) {
        return;
      }

      report();
      break;

    case 'UnaryExpression':
      if (expression.argument.type === 'Literal') {
        return;
      }

      if (options.allowDerived) {
        checkExpression(context, options, expression.argument);
        return;
      }

      report();
      break;

    default:
  }
}

function checkVariableDeclaration(
  context: Rule.RuleContext,
  options: Options,
  node: VariableDeclaration
) {
  for (const declaration of node.declarations) {
    const expression = declaration.init;
    if (expression !== null && expression !== undefined) {
      checkExpression(context, options, expression);
    }
  }
}

export const noTopLevelSideEffects: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow top level side effects',
      url: 'https://github.com/ericcornelissen/eslint-plugin-top/blob/main/docs/rules/no-top-level-side-effects.md'
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
          allowDerived: {
            type: 'boolean'
          },
          commonjs: {
            type: 'boolean'
          }
        }
      }
    ],
    messages: {
      [disallowedSideEffect.id]: disallowedSideEffect.message
    }
  },
  create: (context) => {
    // type-coverage:ignore-next-line
    const provided: Partial<Options> = context.options[0];

    const options: Options = {
      allowedCalls: [
        ...(provided?.commonjs ? ['require'] : ([] as never[])),
        ...(provided?.allowedCalls || allowedCallsOption.default)
      ],
      allowedNews: provided?.allowedNews || allowedNewsOption.default,
      allowIIFE: provided?.allowIIFE || false,
      allowDerived: provided?.allowDerived || false,
      commonjs: provided?.commonjs || false
    };

    return {
      ExpressionStatement: (node) => {
        if (isTopLevel(node)) {
          if (options.allowIIFE && isIIFE(node)) {
            return;
          }

          if (options.commonjs) {
            if (
              node.expression.type === 'CallExpression' &&
              isCallTo(node.expression, 'require')
            ) {
              return;
            } else if (
              node.expression.type === 'AssignmentExpression' &&
              (isExportsAssignment(node) ||
                isExportPropertyAssignment(node) ||
                isModuleAssignment(node) ||
                isModulePropertyAssignment(node))
            ) {
              checkExpression(context, options, node.expression.right);
              return;
            }
          }

          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },

      ExportNamedDeclaration: (node) => {
        if (node.declaration?.type === 'VariableDeclaration') {
          checkVariableDeclaration(context, options, node.declaration);
        }
      },
      VariableDeclaration: (node) => {
        if (isTopLevel(node)) {
          checkVariableDeclaration(context, options, node);
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
