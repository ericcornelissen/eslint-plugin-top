// SPDX-License-Identifier: ISC

import type {Rule} from 'eslint';
import type {CallExpression, NewExpression, AssignmentExpression} from 'estree';

import {IsCommonJs, isTopLevel} from '../helpers';

type Options = {
  readonly allowedCalls: ReadonlyArray<string>;
  readonly allowedNews: ReadonlyArray<string>;
  readonly allowIIFE: boolean;
  readonly allowDerived: boolean;
  readonly commonjs: boolean | undefined;
  readonly isCommonjs: (node: Rule.Node) => boolean;
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

function isCallTo(expression: CallExpression, name: string): boolean {
  return (
    expression.callee.type === 'Identifier' && expression.callee.name === name
  );
}

function isExportsAssignment(node: AssignmentExpression): boolean {
  return node.left.type === 'Identifier' && node.left.name === 'exports';
}

function isExportPropertyAssignment(node: AssignmentExpression): boolean {
  return (
    node.left.type === 'MemberExpression' &&
    node.left.object.type === 'Identifier' &&
    node.left.object.name === 'exports'
  );
}

function isIIFE(node: CallExpression): boolean {
  return (
    node.callee.type === 'ArrowFunctionExpression' ||
    node.callee.type === 'FunctionExpression'
  );
}

function isModuleAssignment(node: AssignmentExpression): boolean {
  return (
    node.left.type === 'MemberExpression' &&
    node.left.object.type === 'Identifier' &&
    node.left.object.name === 'module'
  );
}

function isModulePropertyAssignment(node: AssignmentExpression): boolean {
  return (
    node.left.type === 'MemberExpression' &&
    node.left.object.type === 'MemberExpression' &&
    node.left.object.object.type === 'Identifier' &&
    node.left.object.object.name === 'module' &&
    node.left.object.property.type === 'Identifier' &&
    node.left.object.property.name === 'exports'
  );
}

function isNew(expression: NewExpression, name: string): boolean {
  return (
    expression.callee.type === 'Identifier' && expression.callee.name === name
  );
}

export const noTopLevelSideEffects: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow top level side effects',
      recommended: false,
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
    const provided: Partial<Options> = context.options[0]; // type-coverage:ignore-line

    const options: Options = {
      allowedCalls: provided?.allowedCalls || allowedCallsOption.default,
      allowedNews: provided?.allowedNews || allowedNewsOption.default,
      allowIIFE: provided?.allowIIFE || false,
      allowDerived: provided?.allowDerived || false,
      commonjs: provided?.commonjs,
      isCommonjs: (node) =>
        options.commonjs === undefined ? IsCommonJs(node) : options.commonjs
    };

    return {
      AssignmentExpression: (node) => {
        if (
          options.isCommonjs(node) &&
          (isExportsAssignment(node) ||
            isExportPropertyAssignment(node) ||
            isModuleAssignment(node) ||
            isModulePropertyAssignment(node))
        ) {
          return;
        }

        if (isTopLevel(node)) {
          context.report({
            node: node.parent,
            messageId: disallowedSideEffect.id
          });
        }
      },
      AwaitExpression: (node) => {
        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      BinaryExpression: (node) => {
        if (options.allowDerived) {
          return;
        }

        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      CallExpression: (node) => {
        if (options.isCommonjs(node) && isCallTo(node, 'require')) {
          return;
        }

        if (options.allowedCalls.some((name) => isCallTo(node, name))) {
          return;
        }

        if (
          options.allowIIFE &&
          isIIFE(node) &&
          node.parent.type === 'ExpressionStatement'
        ) {
          return;
        }

        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      ChainExpression: (node) => {
        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      ConditionalExpression: (node) => {
        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      DoWhileStatement: (node) => {
        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      ForInStatement: (node) => {
        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      ForOfStatement: (node) => {
        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      ForStatement: (node) => {
        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      IfStatement: (node) => {
        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      LogicalExpression: (node) => {
        if (options.allowDerived) {
          return;
        }

        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      NewExpression: (node) => {
        if (options.allowedNews.some((name) => isNew(node, name))) {
          return;
        }

        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      SwitchStatement: (node) => {
        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      TaggedTemplateExpression: (node) => {
        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      TemplateLiteral: (node) => {
        if (node.expressions.length === 0) {
          return;
        }

        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      ThrowStatement: (node) => {
        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      TryStatement: (node) => {
        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      UnaryExpression: (node) => {
        if (node.argument.type === 'Literal') {
          return;
        }

        if (options.allowDerived) {
          return;
        }

        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      UpdateExpression: (node) => {
        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      },
      WhileStatement: (node) => {
        if (isTopLevel(node)) {
          context.report({
            node,
            messageId: disallowedSideEffect.id
          });
        }
      }
    };
  }
};
