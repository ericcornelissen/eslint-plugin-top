// SPDX-License-Identifier: ISC

import type {Rule} from 'eslint';
import type {VariableDeclaration} from 'estree';

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
    'Literal',
    'LogicalExpression',
    'MemberExpression',
    'TaggedTemplateExpression',
    'TemplateLiteral',
    'UnaryExpression',
    'UpdateExpression'
  ]
};

const kindOption = {
  enum: ['const', 'let', 'var'],
  default: ['const']
};

const disallowedAssignment = {
  id: '0',
  message: 'Variables at the top level are not allowed'
};
const disallowedVar = {
  id: '1',
  message: 'Use of var at the top level is not allowed'
};
const disallowedLet = {
  id: '2',
  message: 'Use of let at the top level is not allowed'
};
const disallowedConst = {
  id: '3',
  message: 'Use of const at the top level is not allowed'
};

function checker(
  context: Rule.RuleContext,
  options: Options,
  node: VariableDeclaration
) {
  if (!options.kind.includes(node.kind)) {
    let messageId;
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
    }

    context.report({node, messageId});
  } else {
    node.declarations
      .filter(
        (declaration) =>
          declaration.init === null ||
          declaration.init === undefined ||
          !options.allowed.includes(declaration.init.type)
      )
      .forEach((declaration) => {
        context.report({
          node: declaration,
          messageId: disallowedAssignment.id
        });
      });
  }
}

export const noTopLevelVariables: Rule.RuleModule = {
  meta: {
    type: 'problem',
    messages: {
      [disallowedAssignment.id]: disallowedAssignment.message,
      [disallowedConst.id]: disallowedConst.message,
      [disallowedLet.id]: disallowedLet.message,
      [disallowedVar.id]: disallowedVar.message
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowed: {
            type: 'array',
            minItems: 0,
            items: {
              enum: allowedOption.enum
            }
          },
          kind: {
            type: 'array',
            minItems: 0,
            items: {
              enum: kindOption.enum
            }
          }
        }
      }
    ]
  },
  create: (context) => {
    const options: Options = {
      allowed: [
        ...allowedOption.always,
        // type-coverage:ignore-next-line
        ...(context.options[0]?.allowed || allowedOption.default)
      ],
      // type-coverage:ignore-next-line
      kind: context.options[0]?.kind || kindOption.default
    };

    return {
      ExportNamedDeclaration: (node) => {
        if (node.declaration?.type === 'VariableDeclaration') {
          checker(context, options, node.declaration);
        }
      },
      VariableDeclaration: (node) => {
        if (isTopLevel(node)) {
          checker(context, options, node);
        }
      }
    };
  }
};
