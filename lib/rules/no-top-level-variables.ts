// SPDX-License-Identifier: ISC

import type {Rule} from 'eslint';
import type {Declaration, VariableDeclaration} from 'estree';

import {isTopLevel} from '../helpers';

type Options = {
  readonly allowed: ReadonlyArray<string>;
  readonly kind: ReadonlyArray<string>;
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

const allowedValues = [
  'ArrayExpression',
  'ChainExpression',
  'ImportExpression',
  'ObjectExpression',
  'SequenceExpression',
  'ThisExpression',
  'YieldExpression'
];
const allowedDefault: string[] = [];
const allowedAlways = [
  'ArrowFunctionExpression',
  'AssignmentExpression',
  'AwaitExpression',
  'BinaryExpression',
  'CallExpression',
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
];

const kindValues = ['const', 'let', 'var'];
const kindDefault = ['const'];

function checker(
  context: Rule.RuleContext,
  options: Options,
  node: VariableDeclaration
) {
  if (!options.kind.includes(node.kind)) {
    let messageId = disallowedVar.id;
    if (node.kind === 'let') {
      messageId = disallowedLet.id;
    } else if (node.kind === 'const') {
      messageId = disallowedConst.id;
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
      [disallowedVar.id]: disallowedVar.message,
      [disallowedLet.id]: disallowedLet.message,
      [disallowedConst.id]: disallowedConst.message
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowed: {
            type: 'array',
            minItems: 0,
            items: {
              enum: allowedValues
            }
          },
          kind: {
            type: 'array',
            minItems: 0,
            items: {
              enum: kindValues
            }
          }
        }
      }
    ]
  },
  create: (context) => {
    const options: Options = {
      allowed: [
        ...allowedAlways,
        // type-coverage:ignore-next-line
        ...(context.options[0]?.allowed || allowedDefault)
      ],
      // type-coverage:ignore-next-line
      kind: context.options[0]?.kind || kindDefault
    };

    return {
      ExportNamedDeclaration: (node) => {
        // type-coverage:ignore-next-line
        const declaration = node.declaration as Declaration;
        if (declaration.type === 'VariableDeclaration') {
          checker(context, options, declaration);
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
