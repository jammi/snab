const path = require('path');
const fs = require('fs');

const {async, await} = require('asyncawait');

const PluginLoader = require('snab/plugins/plugin-loader');

const texts = require('snab/cli/texts').argv;
const {err, log, warn} = require('./log')('snab:argv');

module.exports = api => {
  const args = api.args;
  api.runMode = {
    cwd: process.cwd(),
    confFiles: [],
    debug: false,
    verbose: false,
    logFg: false,
    autoUpdate: false,
    traceSes: false,
    traceDelegates: false,
    http: [
      // {host: '127.0.0.1', port: 9080}
    ],
    nginx: [
      // {host: '127.0.0.1', port: 9443}
    ],
    mongo: null, // 'mongodb://user@host:port/database',
    runMongod: false, // 9000,
    gearman: {host: null, port: null},
    runGearmand: false,
    resetSes: false,
    latency: 0,
    bandwidth: null,
    say: false,
    disableGzip: false,
    disableObfuscation: false,
    disableJsmin: false,
    buildReport: false,
    projectPath: null,
    extraArgs: []
  };
  const cmdPath = path.resolve(__dirname, '../cli/cmd');
  const pluginLoader = PluginLoader(cmdPath, api);

  const run = name => {
    return pluginLoader
      .load(name)
      .then(plugin => {
        plugin.run();
      })
      .catch(error => {
        err(texts.unableToLoadPlugin, error);
      });
  };
  api.version = fs.readFileSync(path.resolve(__dirname, '../../../VERSION'), 'utf-8').trim();

  const parse = async(argv => {
    if (argv.length) {
      const cmd = argv[0];
      await (pluginLoader
        .hasPlugin(cmd)
        .then(exists => {
          if (exists) {
            run(cmd);
          }
          else {
            warn(texts.invalidCommand(cmd));
          }
        })
        .catch(error => {
          err(texts.cliParserError, error);
        })
      );
    }
    else {
      run('help');
    }
  });

  parse(args.argv);
};
