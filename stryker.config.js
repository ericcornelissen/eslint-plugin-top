// Check out StrykerJS at: https://stryker-mutator.io/

module.exports = {
  coverageAnalysis: 'perTest',
  inPlace: false,
  ignoreStatic: true,
  mutate: ['lib/**/*.ts', '!lib/index.ts'],

  testRunner: 'mocha',
  mochaOptions: {
    config: '.mocharc.yml',
    spec: ['tests/unit/**/*.test.ts']
  },

  incremental: true,
  incrementalFile: '.cache/stryker-incremental.json',

  disableTypeChecks: '{lib,tests}/**/*.ts',
  checkers: ['typescript'],
  tsconfigFile: 'tsconfig.json',

  reporters: ['clear-text', 'dashboard', 'html', 'progress'],
  htmlReporter: {
    fileName: '_reports/mutation/index.html'
  },
  thresholds: {
    // TODO: add thresholds
  },

  tempDirName: '.temp/stryker',
  cleanTempDir: true
};
