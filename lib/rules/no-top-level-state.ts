// SPDX-License-Identifier: ISC

import type {Rule} from 'eslint';

import {isTopLevel} from '../helpers';

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
      recommended: false,
      url: 'https://github.com/ericcornelissen/eslint-plugin-top/blob/main/docs/rules/no-top-level-state.md'
    },
    messages: {
      [disallowedRegexp.id]: disallowedRegexp.message
    }
  },
  create: (context) => {
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
      }
    };
  }
};
