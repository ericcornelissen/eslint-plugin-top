import type {VariableDeclarator} from 'estree';

import {Rule} from 'eslint';
import {isTopLevel} from '../helpers';

export const noTopLevelVariables: Rule.RuleModule = {
  meta: {
    type: 'problem',
    messages: {
      message: `Unexpected variable at the top level`
    },
    schema: [
      {
        type: 'object',
        properties: {
          constAllowed: {
            type: 'array',
            minItems: 0,
            items: {
              enum: ['Literal', 'MemberExpression']
            }
          },
          kind: {
            type: 'array',
            minItems: 1,
            items: {
              enum: ['const', 'let', 'var']
            }
          }
        }
      }
    ]
  },
  create: (context) => {
    const options = {
      constAllowed: context.options[0]?.constAllowed || [
        'Literal',
        'MemberExpression'
      ],
      kind: context.options[0]?.kind || ['const', 'let', 'var']
    };

    return {
      VariableDeclaration: (node) => {
        const isMatching = Array.from(options.kind).includes(node.kind);
        if (!isTopLevel(node) || !isMatching) {
          return;
        }

        let allowedDeclaration: (declaration: VariableDeclarator) => boolean;
        if (node.kind === 'const') {
          const isLiteralAllowed = options.constAllowed.includes('Literal');
          const isMemberExpressionAllowed =
            options.constAllowed.includes('MemberExpression');

          allowedDeclaration = (declaration) => {
            switch ((declaration.init as any).type) {
              case 'CallExpression':
                return (
                  (declaration.init as any).callee.type === 'Identifier' &&
                  (declaration.init as any).callee.name === 'require'
                );
              case 'Literal':
                return isLiteralAllowed;
              case 'MemberExpression':
                return isMemberExpressionAllowed;
            }
          };
        } else {
          allowedDeclaration = (declaration) =>
            declaration.init?.type === 'CallExpression' &&
            declaration.init.callee.type === 'Identifier' &&
            declaration.init.callee.name === 'require';
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
    };
  }
};
