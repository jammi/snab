const path = require('path');

process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

module.exports = () => {

  const args = {
    nodePath: process.argv[0],
    selfPath: path.parse(process.argv[1]).dir,
    argv: process.argv.slice(2)
  };

  const platform = process.platform;

  const api = {

    args,

    traps: {
      // server status signal name:
      info: platform === 'darwin' ? 'INFO' : platform === 'linux' ? 'PWR' : null,
    },

    startupStatus: {
      // true for start/restart -type commands
      startable: false
    },

    // reference to the transport api
    transporter: null,

    // reference to the plugin management api
    pluginManager: null,

    // reference to the value management api
    valueManager: null,

    // reference to the session management api
    sessionManager: null

  };

  require('snab/util/argv')(api);

};
