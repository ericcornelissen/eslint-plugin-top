// Check out StrykerJS at: https://stryker-mutator.io/

const reportDir = '_reports/mutation';

module.exports = {
  coverageAnalysis: 'perTest',
  inPlace: false,
  mutate: ['lib/**/*.ts'],

  testRunner: 'mocha',
  mochaOptions: {
    config: '.mocharc.yml',
    spec: ['tests/unit/**/*.test.ts']
  },

  incremental: true,
  incrementalFile: `${reportDir}/stryker-incremental.json`,

  timeoutMS: 25000,
  timeoutFactor: 2.5,

  disableTypeChecks: '{lib,tests}/**/*.ts',
  checkers: ['typescript'],
  tsconfigFile: 'tsconfig.json',

  reporters: ['clear-text', 'dashboard', 'html', 'progress'],
  htmlReporter: {
    fileName: `${reportDir}/index.html`
  },
  thresholds: {
    // TODO: add thresholds
  },

  tempDirName: '.temp/stryker',
  cleanTempDir: false
};
