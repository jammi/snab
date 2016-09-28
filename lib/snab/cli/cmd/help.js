const path = require('path');

const texts = require('snab/cli/texts').help;
const {err, log, echo, warn} = require('snab/util/log')('snab help');
const PluginLoader = require('snab/plugins/plugin-loader');

module.exports = api => {
  const selfPath = path.resolve(__dirname);
  const pluginLoader = PluginLoader(selfPath, api);
  const argv = api.args.argv;
  const listHelp = () => {
    const helpTexts = [texts.usage];
    pluginLoader
      .loadAll()
      .then(plugins => {
        plugins
          .filter(plugin => {
            return !!plugin.help;
          })
          .forEach(({info, help}) => {
            helpTexts.push(texts.commandList(info.name, help()));
          });
        helpTexts.push(texts.furtherInfo);
        echo(helpTexts.join('\n'));
      })
      .catch(error => {
        err(texts.listHelpError, error);
      });
  };
  const cmdHelp = () => {
    const cmd = argv[1];
    pluginLoader
      .hasPlugin(cmd)
      .then(exists => {
        if (exists) {
          pluginLoader
            .load(cmd, api)
            .then(plugin => {
              echo(plugin.help(true));
            })
            .catch(error => {
              echo(texts.cmdHelpError, error);
            });
        }
        else {
          warn(texts.invalidCmd(cmd) + '\n');
          listHelp();
        }
      })
      .catch(error => {
        err(texts.cmdHelpError, error);
      });
  };
  return {
    init: () => {},
    run: () => {
      if (!argv.length) {
        echo(texts.noCommandGiven);
        listHelp();
      }
      else if (argv[0] === 'help' && argv.length > 1) {
        cmdHelp();
      }
      else {
        listHelp();
      }
    },
    help: () => {
      return texts.title;
    }
  };
};
