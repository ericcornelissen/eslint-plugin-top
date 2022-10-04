const cp = require('node:child_process');
const path = require('node:path');

const emptyLine = ' '.repeat(process.stdout.columns);
const print = (s) => process.stdout.write(s);
const println = (s) => print(`${s}\n`);
const reprint = (s) => print(`\r${emptyLine}\r${s}`);
const reprintln = (s) => reprint(`${s}\n`);

function runCompatibilityTestsOn(nodeVersion) {
  const projectRoot = path.resolve('.');
  const workdir = '/eslint-plugin-top';

  const {status, stderr} = cp.spawnSync(
    'docker',
    [
      'run',
      '--rm',
      '--user',
      'node',
      '--workdir',
      workdir,
      '--mount',
      `type=bind,source=${projectRoot},target=${workdir}`,
      '--name',
      `eslint-plugin-top-compatibility-test-on-node${nodeVersion}`,
      `node:${nodeVersion}`,
      'npm',
      'run',
      'test:compat'
    ],
    {encoding: 'utf-8'}
  );

  return {
    success: status === 0,
    stderr
  };
}

const nodeVersions = ['12', '14', '16', '18'];

const fails = [];
for (const nodeVersion of nodeVersions) {
  print(`Running compatibility tests on Node.js v${nodeVersion}...`);
  const {success, stderr} = runCompatibilityTestsOn(nodeVersion);
  if (success) {
    reprintln(`Compatibility tests succeeded on Node.js v${nodeVersion}`);
  } else {
    reprintln(`Compatibility tests failed on Node.js v${nodeVersion}`);
    fails.push({error: stderr, nodeVersion});
  }
}

if (fails.length > 0) {
  println('');
  for (const {error, nodeVersion} of fails) {
    println('');
    println(`Compatibility tests failed on Node.js v${nodeVersion} with:`);
    println('');
    println(error);
  }
}
