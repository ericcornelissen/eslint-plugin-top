// Check out StrykerJS at: https://stryker-mutator.io/

module.exports = {
  coverageAnalysis: 'perTest',
  inPlace: false,
  mutate: ['lib/**/*.ts'],
  commandRunner: {
    command: 'npm run test'
  },

  timeoutMS: 25000,
  timeoutFactor: 2.5,

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
  cleanTempDir: false
};
