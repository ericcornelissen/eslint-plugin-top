// SPDX-License-Identifier: ISC

import {configRecommended} from './configs/recommended';
import {configStrict} from './configs/strict';
import {noTopLevelSideEffects} from './rules/no-top-level-side-effects';
import {noTopLevelState} from './rules/no-top-level-state';
import {noTopLevelVariables} from './rules/no-top-level-variables';

/**
 * @public
 */
export const rules = {
  'no-top-level-side-effects': noTopLevelSideEffects,
  'no-top-level-state': noTopLevelState,
  'no-top-level-variables': noTopLevelVariables
};

/**
 * @public
 */
export const configs = {
  recommended: configRecommended,
  strict: configStrict
};
