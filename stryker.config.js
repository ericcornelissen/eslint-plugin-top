// Check out StrykerJS at: https://stryker-mutator.io/

module.exports = {
  coverageAnalysis: 'perTest',
  inPlace: false,
  ignoreStatic: true,
  mutate: ['lib/**/*.ts', '!lib/index.ts', '!lib/configs/*.ts'],

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

  reporters: ['clear-text', 'html', 'progress'],
  htmlReporter: {
    fileName: '_reports/mutation/index.html'
  },
  thresholds: {
    high: 100,
    low: 100,
    break: 100
  },

  tempDirName: '.temp/stryker',
  cleanTempDir: true
};
