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
              enum: ['Literal']
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
      constAllowed: context.options[0]?.constAllowed || ['Literal'],
      kind: context.options[0]?.kind || ['const', 'let', 'var']
    };

    return {
      VariableDeclaration: (node) => {
        const isMatching = Array.from(options.kind).includes(node.kind);
        if (!isTopLevel(node) || !isMatching) {
          return;
        }

        node.declarations.forEach((declaration) => {
          const isRequire =
            declaration.init?.type === 'CallExpression' &&
            declaration.init.callee.type === 'Identifier' &&
            declaration.init.callee.name === 'require';
          const isLiteral =
            node.kind === 'const' &&
            options.constAllowed.includes('Literal') &&
            (declaration.init as any).type === 'Literal';

          if (!isRequire && !isLiteral) {
            context.report({
              node: declaration,
              messageId: 'message'
            });
          }
        });
      }
    };
  }
};
