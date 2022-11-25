import {noTopLevelSideEffect} from './rules/no-top-level-side-effect';
import {noTopLevelVariables} from './rules/no-top-level-variables';

/**
 * @fileoverview Disallow side effects at the top level of files
 * @author Damien Erambert
 */

/**
 * @public
 */
export const rules = {
  'no-top-level-variables': noTopLevelVariables,
  'no-top-level-side-effect': noTopLevelSideEffect
};
