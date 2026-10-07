// SPDX-License-Identifier: MIT-0

const console = require('node:console');
const process = require('node:process');

const configModule = require('../eslint.config.mjs');
const configArray = configModule.default;

const all = new Set();
const configured = new Set();
const links = new Map();

for (const config of configArray) {
  for (const pluginName in config.plugins) {
    const plugin = config.plugins[pluginName];
    for (const ruleName in plugin.rules) {
      const rule = plugin.rules[ruleName];
      if (!rule?.meta?.deprecated) {
        const ruleId = pluginName ? `${pluginName}/${ruleName}` : ruleName;
        all.add(ruleId);

        const link = rule?.meta?.docs?.url;
        if (link) {
          links.set(ruleId, link);
        }
      }
    }
  }

  for (const ruleId in config.rules) {
    configured.add(ruleId);
  }
}

const unconfigured = all.difference(configured);
if (unconfigured.size > 0) {
  for (const rule of unconfigured) {
    const text = `'${rule}'`;
    const link = links.has(rule) ? `(<${links.get(rule)}>)` : '';
    console.log(`${text} ${link}`);
  }
  console.log('');
  console.log(
    unconfigured.size,
    'missing rule(s) found.',
    'Explicitly configure each of them.'
  );

  process.exit(1);
}

const overconfigured = configured
  .difference(all)
  .keys()
  .filter((rule) => rule.includes('/'))
  .toArray();
if (overconfigured.length > 0) {
  for (const rule of overconfigured) {
    console.log(`'${rule}'`);
  }
  console.log('');
  console.log(
    overconfigured.length,
    'rule(s) configured but not found.',
    'Remove each of them.'
  );

  process.exit(1);
}

console.log('No problems detected');
