// SPDX-License-Identifier: ISC

import type {Rule} from 'eslint';
import type {
  AssignmentExpression,
  CallExpression,
  Expression,
  Identifier,
  NewExpression,
  PrivateIdentifier,
  Program,
  VariableDeclarator
} from 'estree';

import {getProgram, IsCommonJs, isTopLevel} from '../helpers';

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

const defaultOptions: Omit<Options, 'isCommonjs'> = {
  allowDerived: false,
  allowedCalls: ['Symbol'],
  allowedNews: [],
  allowFunctionProperties: false,
  allowIIFE: false,
  allowPropertyAccess: true,
  commonjs: undefined
};

const disallowedRequireShadow = {
  id: '1',
  message: 'Shadowing `require` is not allowed'
};
const disallowedSideEffect = {
  id: '0',
  message: 'Side effects at the top level are not allowed'
};

function assignsFunctionProperty(
  node: AssignmentExpression,
  program: Program
): boolean {
  if (
    node.left.type !== 'MemberExpression' ||
    node.left.object.type !== 'Identifier'
  ) {
    return false;
  }

  for (const stmt of program.body) {
    if (
      stmt.type === 'FunctionDeclaration' &&
      stmt.id.name === node.left.object.name
    ) {
      return true;
    }
  }

  return false;
}

function isCallTo(node: CallExpression, name: string): boolean {
  if (node.callee.type === 'Identifier') {
    return node.callee.name === name;
  }

  if (node.callee.type === 'MemberExpression') {
    let expr = node.callee;
    const id: string[] = [];
    while (true) {
      if (expr.computed) {
        return false;
      }

      const property = expr.property as Identifier; // type-coverage:ignore-line
      id.push(property.name);

      if (expr.object.type === 'MemberExpression') {
        expr = expr.object;
      } else if (expr.object.type === 'Identifier') {
        id.push(expr.object.name);
        break;
      } else {
        return false;
      }
    }

    id.reverse();
    return name === id.join('.');
  }

  return false;
}

function isCommonJsExportAssignment(node: AssignmentExpression): boolean {
  return (
    isExportsAssignment(node) ||
    isExportPropertyAssignment(node) ||
    isModuleAssignment(node) ||
    isModulePropertyAssignment(node)
  );
}

function isDestructuring(node: VariableDeclarator): boolean {
  return node.id.type === 'ObjectPattern' || node.id.type === 'ArrayPattern';
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

function isNew(node: NewExpression, name: string): boolean {
  return node.callee.type === 'Identifier' && node.callee.name === name;
}

function isNumericLiteral(node: Expression | PrivateIdentifier): boolean {
  return node.type === 'Literal' && typeof node.value === 'number';
}

function shadowsRequire(node: VariableDeclarator): boolean {
  if (node.id.type === 'Identifier') {
    return node.id.name === 'require';
  }

  if (node.id.type === 'ObjectPattern') {
    for (const property of node.id.properties) {
      if (
        property.type === 'Property' &&
        property.key.type === 'Identifier' &&
        property.key.name === 'require'
      ) {
        return true;
      }
    }
  }

  if (node.id.type === 'ArrayPattern') {
    for (const element of node.id.elements) {
      if (
        element !== null &&
        element.type === 'Identifier' &&
        element.name === 'require'
      ) {
        return true;
      }
    }
  }

  return false;
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
    const [provided] = context.options as Partial<Options>[]; // type-coverage:ignore-line

    const options: Options = {
      ...defaultOptions,
      ...provided,
      isCommonjs: (node) =>
        options.commonjs === undefined ? IsCommonJs(node) : options.commonjs
    };

    return {
      AssignmentExpression: (node) => {
        if (isCommonJsExportAssignment(node) && options.isCommonjs(node)) {
          return;
        }

        if (
          assignsFunctionProperty(node, getProgram(node)) &&
          options.allowFunctionProperties
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
        if (isCallTo(node, 'require') && options.isCommonjs(node)) {
          return;
        }

        if (options.allowedCalls.some((name) => isCallTo(node, name))) {
          return;
        }

        if (
          isIIFE(node) &&
          node.parent.type === 'ExpressionStatement' &&
          options.allowIIFE
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
        if (
          node.id?.name === 'require' &&
          isTopLevel(node) &&
          options.isCommonjs(node)
        ) {
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
        if (node.parent.type === 'CallExpression') {
          return; // prefer reporting as respective expression.
        }

        const isAccess = !(
          node.parent.type === 'AssignmentExpression' &&
          node.parent.left === node
        );
        const isComputed = node.computed && !isNumericLiteral(node.property);
        const mayAccess = !isAccess || options.allowPropertyAccess;
        const maybeComputed = !isComputed || options.allowDerived;
        if (mayAccess && maybeComputed) {
          return;
        }

        if (isTopLevel(node)) {
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
        if (options.allowDerived) {
          return;
        }

        if (!node.computed) {
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
        if (options.allowDerived) {
          return;
        }

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
        if (options.allowDerived) {
          return;
        }

        if (node.operator === '-' && isNumericLiteral(node.argument)) {
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
      VariableDeclarator: (node) => {
        if (!isTopLevel(node)) {
          return;
        }

        if (shadowsRequire(node) && options.isCommonjs(node)) {
          context.report({
            node: node.id,
            messageId: disallowedRequireShadow.id
          });
        }

        if (isDestructuring(node) && !options.allowPropertyAccess) {
          context.report({
            node: node.id,
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
