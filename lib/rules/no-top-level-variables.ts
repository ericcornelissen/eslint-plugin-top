// SPDX-License-Identifier: ISC

import type {Rule} from 'eslint';
import type {Expression, VariableDeclaration, VariableDeclarator} from 'estree';

import {isTopLevel} from '../helpers';

type Options = {
  readonly allowed: ReadonlyArray<string>;
  readonly kind: ReadonlyArray<string>;
};

const allowedOption = {
  enum: [
    'ArrayExpression',
    'ImportExpression',
    'ObjectExpression',
    'SequenceExpression',
    'ThisExpression',
    'YieldExpression'
  ],
  default: [],
  always: [
    'ArrowFunctionExpression',
    'AssignmentExpression',
    'AwaitExpression',
    'BinaryExpression',
    'CallExpression',
    'ChainExpression',
    'ConditionalExpression',
    'FunctionExpression',
    'Identifier',
    'ImportExpression',
    'Literal',
    'LogicalExpression',
    'MemberExpression',
    'SequenceExpression',
    'TaggedTemplateExpression',
    'TemplateLiteral',
    'ThisExpression',
    'UnaryExpression',
    'UpdateExpression'
  ]
};
const kindOption = {
  enum: ['await using', 'const', 'let', 'using', 'var'],
  default: ['const']
};

const disallowedAssignment = {
  id: '0',
  message: 'Variables at the top level are not allowed'
};
const disallowedVar = {
  id: '1',
  message: "Use of 'var' at the top level is not allowed"
};
const disallowedLet = {
  id: '2',
  message: "Use of 'let' at the top level is not allowed"
};
const disallowedConst = {
  id: '3',
  message: "Use of 'const' at the top level is not allowed"
};
const disallowedUsing = {
  id: '4',
  message: "Use of 'using' at the top level is not allowed"
};

function isInitialized(
  node: VariableDeclarator
): node is VariableDeclarator & {init: Expression} {
  return node.init != null;
}

export const noTopLevelVariables: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow top level variables',
      recommended: false,
      url: 'https://github.com/ericcornelissen/eslint-plugin-top/blob/main/docs/rules/no-top-level-variables.md'
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowed: {
            description: 'Configure what kind of assignments are allowed',
            type: 'array',
            minItems: 0,
            items: {
              enum: allowedOption.enum
            }
          },
          kind: {
            description: 'Configure which kinds of variables are allowed',
            type: 'array',
            minItems: 0,
            items: {
              enum: kindOption.enum
            }
          }
        }
      }
    ],
    messages: {
      [disallowedAssignment.id]: disallowedAssignment.message,
      [disallowedConst.id]: disallowedConst.message,
      [disallowedLet.id]: disallowedLet.message,
      [disallowedUsing.id]: disallowedUsing.message,
      [disallowedVar.id]: disallowedVar.message
    }
  },
  create: (context) => {
    const [provided] = context.options as Partial<Options>[]; // type-coverage:ignore-line

    const options: Options = {
      allowed: [
        ...allowedOption.always,
        ...(provided?.allowed || allowedOption.default)
      ],
      kind: provided?.kind || kindOption.default
    };

    return {
      VariableDeclaration: (node) => {
        if (options.kind.includes(node.kind)) {
          return;
        }

        if (!isTopLevel(node)) {
          return;
        }

        let messageId: string | null;
        switch (node.kind) {
          case 'var':
            messageId = disallowedVar.id;
            break;
          case 'let':
            messageId = disallowedLet.id;
            break;
          case 'const':
            messageId = disallowedConst.id;
            break;
          case 'using':
          case 'await using':
            messageId = disallowedUsing.id;
            break;
        }

        context.report({node, messageId});
      },
      VariableDeclarator: (node) => {
        const parent = node.parent as VariableDeclaration; // type-coverage:ignore-line
        if (!options.kind.includes(parent.kind)) {
          return;
        }

        if (isInitialized(node) && options.allowed.includes(node.init.type)) {
          return;
        }

        if (!isTopLevel(node)) {
          return;
        }

        context.report({
          node,
          messageId: disallowedAssignment.id
        });
      }
    };
  }
};
