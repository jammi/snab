const path = require('path');
const fs = require('fs');
const PluginLoader = require('snab/plugins/plugin-loader');

const texts = require('snab/cli/texts').status;
const argvParser = require('snab/util/argv-parser');
const {err, log, warn} = require('snab/util/log')('snab:cmd:status');

module.exports = api => {
  const argv = api.args.argv.slice(1);
  const runMode = api.runMode;
  const parseArgs = () => {
    argvParser(runMode, argv).parseRunArgs();
  };
  return {
    init: () => {
      // prepare structures
    },
    run: () => {
      parseArgs();
      const servicePaths = [
        path.resolve(__dirname, '../../services')
      ];
      if (runMode.projectPath &&
          fs.existsSync(runMode.projectPath)
      ) {
        const projServices = path.resolve(runMode.projectPath, 'services');
        if (fs.existsSync(projServices)) {
          servicePaths.push(projServices);
        }
      }
      servicePaths.forEach(servicePath =>
        PluginLoader(servicePath, api, ['status'])
          .loadAll()
          .then(plugins =>
            Promise.all(
              plugins.map(plugin =>
                Promise.resolve(plugin.status())
              )
            )
          )
          .catch(error =>
            err(texts.unableToLoadPlugin, error)
          )
        );
    },
    help: detail =>
      detail ? texts.usage : texts.title
  };
};
