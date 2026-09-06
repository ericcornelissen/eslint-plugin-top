// SPDX-License-Identifier: ISC

import type {Rule} from 'eslint';
import type {Expression, VariableDeclaration, VariableDeclarator} from 'estree';

import {isTopLevel} from '../helpers';

type Options = {
  readonly kind: ReadonlyArray<string>;
};

const kindOption = {
  enum: ['await using', 'const', 'let', 'using', 'var'],
  default: ['const']
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
const disallowedUninitializedVar = {
  id: '5',
  message: "An uninitalized 'var' at the top level is not allowed"
};
const disallowedUninitializedLet = {
  id: '6',
  message: "An uninitalized 'let' at the top level is not allowed"
};

function isInitialized(
  node: VariableDeclarator
): node is VariableDeclarator & {init: Expression} {
  return node.init !== null;
}

export const noTopLevelVariables: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow top level variables',
      recommended: true,
      url: 'https://github.com/ericcornelissen/eslint-plugin-top/blob/main/docs/rules/no-top-level-variables.md'
    },
    schema: [
      {
        type: 'object',
        properties: {
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
      [disallowedConst.id]: disallowedConst.message,
      [disallowedLet.id]: disallowedLet.message,
      [disallowedUsing.id]: disallowedUsing.message,
      [disallowedVar.id]: disallowedVar.message,
      [disallowedUninitializedVar.id]: disallowedUninitializedVar.message,
      [disallowedUninitializedLet.id]: disallowedUninitializedLet.message
    }
  },
  create: (context) => {
    const [provided] = context.options as Partial<Options>[]; // type-coverage:ignore-line

    const options: Options = {
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
          case 'var': {
            messageId = disallowedVar.id;
            break;
          }
          case 'let': {
            messageId = disallowedLet.id;
            break;
          }
          case 'const': {
            messageId = disallowedConst.id;
            break;
          }
          case 'using':
          case 'await using': {
            messageId = disallowedUsing.id;
            break;
          }
        }

        context.report({node, messageId});
      },
      VariableDeclarator: (node) => {
        const parent = node.parent as VariableDeclaration; // type-coverage:ignore-line
        if (!options.kind.includes(parent.kind)) {
          return; // Prefer reporting the whole declaration.
        }

        if (isInitialized(node)) {
          return;
        }

        if (!isTopLevel(node)) {
          return;
        }

        if (parent.kind === 'var') {
          context.report({
            node,
            messageId: disallowedUninitializedVar.id
          });
        } else {
          context.report({
            node,
            messageId: disallowedUninitializedLet.id
          });
        }
      }
    };
  }
};
