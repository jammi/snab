const {err, echo, log, warn} = require('snab/util/log')('test-project:test');

module.exports = api => {

  // list of child-process pid's
  const pids = [];

  // stdin/stdout/stderr streams associated by pid
  const ioStreams = {};

  return {

    // initial configuration / setup
    // like config files and such, if any:
    init: () => {

    },

    // return process ids
    pids: () => {
      return pids;
    },

    // runs once
    run: () => {
      echo('runs once?');
    },

    // starts the process(es)
    start: () => {
      echo('starts?');
    },

    // restarts the process(es)
    restart: () => {
      echo('restarts?');
    },

    // kills the process(es)
    stop: () => {
      echo('stops?');
    },

    // shows status of process(es)
    status: () => {
      echo('status: ?');
    },

    // returns io streams of stdin/stdout
    logs: () => {
      return ioStreams;
    },

    // returns relevant files to watch for restarts, if any
    watch: () => {
      return () => {
        return false;
      };
    }
  };
};
