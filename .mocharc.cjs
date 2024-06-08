// Check out Mocha at: https://mochajs.org/

const config = {};

const nodeVersion = process.versions.node.split('.').map(Number);
if (nodeVersion[0] >= 22) {
  config.import = 'tsx/esm';
} else {
  config.loader = 'tsx/esm';
}

module.exports = config;
