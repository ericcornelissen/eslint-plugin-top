// SPDX-License-Identifier: ISC

import type {Rule} from 'eslint';
import type {
  CallExpression,
  NewExpression,
  AssignmentExpression,
  VariableDeclarator
} from 'estree';

import {IsCommonJs, isTopLevel} from '../helpers';

type Options = {
  readonly allowDerived: boolean;
  readonly allowedCalls: ReadonlyArray<string>;
  readonly allowedNews: ReadonlyArray<string>;
  readonly allowFunctionProperties: boolean;
  readonly allowIIFE: boolean;
  readonly allowPropertyAccess: boolean;
  readonly commonjs: boolean | undefined;
  readonly isCommonjs: (node: Rule.Node) => boolean;
};

const allowDerivedOption = {
  default: false
};
const allowedCallsOption = {
  default: ['Symbol']
};
const allowedNewsOption = {
  default: []
};
const allowFunctionPropertiesOption = {
  default: false
};
const allowIIFEOption = {
  default: false
};
const allowPropertyAccessOption = {
  default: true
};

const disallowedRequireShadow = {
  id: '1',
  message: 'Shadowing `require` is not allowed'
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

function isDestructuring(declaration: VariableDeclarator): boolean {
  return (
    declaration.id.type === 'ObjectPattern' ||
    declaration.id.type === 'ArrayPattern'
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
          allowDerived: {
            description:
              'Configure whether derivations are allowed at the top level',
            type: 'boolean'
          },
          allowedCalls: {
            description:
              'Configure what function calls are allowed at the top level',
            type: 'array',
            minItems: 0
          },
          allowedNews: {
            description:
              'Configure what classes can be instantiated at the top level',
            type: 'array',
            minItems: 0
          },
          allowFunctionProperties: {
            description:
              'Configure whether function declarations can be extended with properties',
            type: 'boolean'
          },
          allowIIFE: {
            description:
              'Configure whether top level Immediately Invoked Function Expressions (IIFEs) are allowed',
            type: 'boolean'
          },
          allowPropertyAccess: {
            description:
              'Configure whether top level property accesses (and destructuring) are allowed',
            type: 'boolean'
          },
          commonjs: {
            description:
              'Configure whether the code being analyzed is, or is partially, CommonJS code',
            type: 'boolean'
          }
        }
      }
    ],
    messages: {
      [disallowedRequireShadow.id]: disallowedRequireShadow.message,
      [disallowedSideEffect.id]: disallowedSideEffect.message
    }
  },
  create: (context) => {
    const provided: Partial<Options> = context.options[0]; // type-coverage:ignore-line

    const options: Options = {
      allowDerived: provided?.allowDerived || allowDerivedOption.default,
      allowedCalls: provided?.allowedCalls || allowedCallsOption.default,
      allowedNews: provided?.allowedNews || allowedNewsOption.default,
      allowFunctionProperties:
        provided?.allowFunctionProperties ||
        allowFunctionPropertiesOption.default,
      allowIIFE: provided?.allowIIFE || allowIIFEOption.default,
      allowPropertyAccess:
        provided?.allowPropertyAccess === undefined
          ? allowPropertyAccessOption.default
          : provided.allowPropertyAccess,
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

        if (
          options.allowFunctionProperties &&
          node.left.type === 'MemberExpression' &&
          node.left.object.type === 'Identifier' &&
          (!node.left.computed || options.allowDerived)
        ) {
          const id = node.left.object.name;

          let program = node.parent;
          while (program.type !== 'Program') {
            program = program.parent;
          }

          for (const node of program.body) {
            if (node.type !== 'FunctionDeclaration') {
              continue;
            }

            if (node.id.name === id) {
              return;
            }
          }
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
      FunctionDeclaration: (node) => {
        if (!isTopLevel(node)) {
          return;
        }

        if (options.isCommonjs(node) && node.id.name === 'require') {
          context.report({
            node: node.id,
            messageId: disallowedRequireShadow.id
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
      MemberExpression: (node) => {
        if (
          (node.parent.type === 'AssignmentExpression' &&
            node.parent.left === node) ||
          node.parent.type === 'CallExpression'
        ) {
          return; // not reported here.
        }

        if (!options.allowPropertyAccess && isTopLevel(node)) {
          context.report({
            node: node,
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
      Property: (node) => {
        if (options.allowDerived || !node.computed) {
          return;
        }

        if (isTopLevel(node)) {
          context.report({
            node: node.key,
            messageId: disallowedSideEffect.id
          });
        }
      },
      SpreadElement: (node) => {
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
      VariableDeclaration: (node) => {
        if (!isTopLevel(node)) {
          return;
        }

        for (const declaration of node.declarations) {
          if (options.isCommonjs(node)) {
            if (
              declaration.id.type === 'Identifier' &&
              declaration.id.name === 'require'
            ) {
              context.report({
                node: declaration.id,
                messageId: disallowedRequireShadow.id
              });
            }
          }

          if (!options.allowPropertyAccess && isDestructuring(declaration)) {
            context.report({
              node: declaration.id,
              messageId: disallowedSideEffect.id
            });
          }
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
