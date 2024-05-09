// SPDX-License-Identifier: ISC

import {configRecommended} from './configs/recommended';
import {configStrict} from './configs/strict';
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

/**
 * @public
 */
export const configs = {
  recommended: configRecommended,
  strict: configStrict
};
