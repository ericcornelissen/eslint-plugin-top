// SPDX-License-Identifier: ISC

import type {Rule} from 'eslint';
import type {
  Declaration,
  Expression,
  CallExpression,
  VariableDeclaration,
  VariableDeclarator
} from 'estree';

import {isTopLevel} from '../helpers';

type Options = {
  readonly constAllowed: ReadonlyArray<string>;
  readonly kind: ReadonlyArray<string>;
};

const violationMessage = 'Variables at the top level are not allowed';

const constAllowedValues = [
  'ArrowFunctionExpression',
  'Literal',
  'MemberExpression'
];
const kindValues = ['const', 'let', 'var'];

function isRequireCall(node: CallExpression): boolean {
  return node.callee.type === 'Identifier' && node.callee.name === 'require';
}

function checker(
  context: Rule.RuleContext,
  options: Options,
  node: VariableDeclaration
) {
  if (!Array.from(options.kind).includes(node.kind)) {
    return;
  }

  let allowedDeclaration: (declaration: VariableDeclarator) => boolean;
  if (node.kind === 'const') {
    const isArrowFunctionAllowed = options.constAllowed.includes(
      'ArrowFunctionExpression'
    );
    const isLiteralAllowed = options.constAllowed.includes('Literal');
    const isMemberExpressionAllowed =
      options.constAllowed.includes('MemberExpression');

    allowedDeclaration = (declaration) => {
      // type-coverage:ignore-next-line
      switch ((declaration.init as Expression).type) {
        case 'ArrowFunctionExpression':
          return isArrowFunctionAllowed;
        case 'CallExpression': {
          // type-coverage:ignore-next-line
          return isRequireCall(declaration.init as CallExpression);
        }
        case 'Identifier':
          return true;
        case 'Literal':
          return isLiteralAllowed;
        case 'MemberExpression':
          return isMemberExpressionAllowed;
        default:
          return false;
      }
    };
  } else {
    allowedDeclaration = (declaration) =>
      declaration.init?.type === 'CallExpression' &&
      isRequireCall(declaration.init);
  }

  node.declarations
    .filter((declaration) => !allowedDeclaration(declaration))
    .forEach((declaration) => {
      context.report({
        node: declaration,
        messageId: 'message'
      });
    });
}

export const noTopLevelVariables: Rule.RuleModule = {
  meta: {
    type: 'problem',
    messages: {
      message: violationMessage
    },
    schema: [
      {
        type: 'object',
        properties: {
          constAllowed: {
            type: 'array',
            minItems: 0,
            items: {
              enum: constAllowedValues
            }
          },
          kind: {
            type: 'array',
            minItems: 1,
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
      // type-coverage:ignore-next-line
      constAllowed: context.options[0]?.constAllowed || constAllowedValues,
      // type-coverage:ignore-next-line
      kind: context.options[0]?.kind || kindValues
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
