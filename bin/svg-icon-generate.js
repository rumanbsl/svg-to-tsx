#! /usr/bin/env node
const path = require('path');
const configureGenerator = require('../lib');

const argv = require('yargs')
  .options({
    tsx: { type: "boolean", default: true },
    reactPureRender: { type: "boolean", default: false },
    native: { type: "boolean", default: false },
    keepFillColor: { type: "boolean", default: false },
    template: { type: "string" },
    verbose: { type: "boolean", default: false },
  })
  .usage('Usage: \n$0 --svgDir [./assets/svgs] --destination [./src/components/Icon.jsx]')
  .demandOption(['svgDir', 'destination'])
  .argv

if (argv.verbose) {
  console.table(argv);
}

configureGenerator(argv).then(fn => fn());
