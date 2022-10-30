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
    const options = context.options[0] || {
      kind: ['const', 'let', 'var']
    };

    return {
      VariableDeclaration: (node) => {
        const isMatching = Array.from(options.kind).includes(node.kind);
        const isRequire =
          node.declarations[0].init?.type === 'CallExpression' &&
          node.declarations[0].init.callee.type === 'Identifier' &&
          node.declarations[0].init.callee.name === 'require';
        const isLiteral =
          node.kind === 'const' &&
          (node.declarations[0].init as any).type === 'Literal';

        if (isMatching && !isRequire && !isLiteral) {
          if (isTopLevel(node)) {
            context.report({node: node.declarations[0], messageId: 'message'});
          }
        }
      }
    };
  }
};
