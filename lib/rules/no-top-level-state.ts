// SPDX-License-Identifier: ISC

import type {Rule} from 'eslint';

import {isInitialized, isTopLevel} from '../helpers';

type Options = {
  readonly allow: ReadonlyArray<string>;
};

const allowOption = {
  enum: ['ArrayExpression', 'ObjectExpression'],
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

const disallowedArray = {
  id: '1',
  message: 'Arrays are stateful (mutable) and not allowed at the top level'
};
const disallowedObject = {
  id: '2',
  message: 'Objects are stateful (mutable) and not allowed at the top level'
};
const disallowedRegexp = {
  id: '0',
  message:
    'Regular expressions with the `g` or `y` flag are stateful and not allowed at the top level'
};

export const noTopLevelState: Rule.RuleModule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow top level state',
      recommended: true,
      url: 'https://github.com/ericcornelissen/eslint-plugin-top/blob/main/docs/rules/no-top-level-state.md'
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: {
            description:
              'Configure what is allowed to be assigned to variables',
            type: 'array',
            minItems: 0,
            items: {
              enum: allowOption.enum
            }
          }
        }
      }
    ],
    messages: {
      [disallowedArray.id]: disallowedArray.message,
      [disallowedObject.id]: disallowedObject.message,
      [disallowedRegexp.id]: disallowedRegexp.message
    }
  },
  create: (context) => {
    const [provided] = context.options as Partial<Options>[]; // type-coverage:ignore-line

    const options: Options = {
      allow: [
        ...allowOption.always,
        ...(provided?.allow || allowOption.default)
      ]
    };

    return {
      Literal: (node) => {
        if (!('regex' in node)) {
          return;
        }

        if (
          !node.regex.flags.includes('g') &&
          !node.regex.flags.includes('y')
        ) {
          return;
        }

        if (!isTopLevel(node)) {
          return;
        }

        context.report({
          node,
          messageId: disallowedRegexp.id
        });
      },
      VariableDeclarator: (node) => {
        if (!isInitialized(node)) {
          return;
        }

        if (options.allow.includes(node.init.type)) {
          return;
        }

        if (!isTopLevel(node)) {
          return;
        }

        if (node.init.type === 'ArrayExpression') {
          context.report({
            node: node.init,
            messageId: disallowedArray.id
          });
        } else {
          context.report({
            node: node.init,
            messageId: disallowedObject.id
          });
        }
      }
    };
  }
};
