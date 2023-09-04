// SPDX-License-Identifier: ISC

import {noTopLevelSideEffects} from './rules/no-top-level-side-effects';
import {noTopLevelVariables} from './rules/no-top-level-variables';

/**
 * @fileoverview Disallow side effects at the top level of files
 */

/**
 * @public
 */
export const rules = {
  'no-top-level-variables': noTopLevelVariables,
  'no-top-level-side-effects': noTopLevelSideEffects
};
