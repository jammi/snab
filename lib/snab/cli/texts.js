const {ljust} = require('snab/util/strf');
const chalk = require('chalk');

const bold = str => {
  return chalk.bold(str);
};

const optFormat = (colWidth, opts) => {
  const arr = [ljust('  ' + opts.shift(), colWidth)];
  arr[0] += opts.shift();
  opts.forEach(opt => {
    arr.push(' '.repeat(colWidth) + opt);
  });
  return arr;
};

// Options shared by run and start
const runOptions = {

  confFile: optFormat(30, [`--conf ${bold('file.yaml')}`,
    'Additional configuration file, can be given multiple times.',
    `The ${bold('file.yaml')} is the configuration file to add to the`,
    'list of configuration files. The default one is the',
    `${bold('conf/config.yaml')} file relative to your project directory,`,
    'which is always loaded first.\n'
  ]).join('\n'),

  debug: optFormat(30, ['--debug (-d)',
    'Development (debug) mode. Shortcut for setting several',
    'options useful for developers. Don’t use in a production',
    'environment, because it’s not as secure and has a noticeable',
    'performance penalty.',
    `Same as using all of the ${bold('-afv --disable-gzip')}`,
    `${bold('--disable-obfuscation --disable-jsmin --build-report')} options`,
    'simultaneously and also enables specific debugging messages.\n'
  ]).join('\n'),

  verbose: optFormat(30, ['--verbose (-v)',
    'Verbose output. Useful for troubleshooting.\n'
  ]).join('\n'),

  autoUpdate: optFormat(30, ['--auto-update (-a)',
    'Automatic client resource rebuilds and restarts of the',
    'appropriate type of server services whenever a project file',
    'change is detected. Also makes connected clients reload',
    'automatically. Useful for development and some production',
    'environments.\n'
  ]).join('\n'),

  logFg: optFormat(30, ['--log-fg (-f)',
    'Prints log messages, errors and warnings into stdout/stderr',
    'rather than into a log file. Useful for development.\n'
  ]).join('\n'),

  traceSes: optFormat(30, ['--trace-ses',
    'Prints client session synchronization transactions into',
    'stdout. Useful for troubleshooting in development.\n'
  ]).join('\n'),

  traceDelegates: optFormat(30, ['--trace-delegates',
    'Prints server session value delegation transactions',
    'into stdout. Useful for troubleshooting in development.\n'
  ]).join('\n'),

  http: optFormat(30, [`--http ${bold('host')}:${bold('port')}`,
    'Sets the http server host and port. Replaces the one(s)',
    'set in the configuration file(s). When given multiple times,',
    'binds several host/port pairs. Also supports port ranges',
    `like ${bold('127.0.0.1:9080-9089')}, which binds all ports ranging from`,
    'the first (9080) up to and including the last (9089).\n'
  ]).join('\n'),

  runNginx: optFormat(30, [`--run-nginx ${bold('host')}:${bold('port')}`,
    'Starts an ssl-enabled nginx proxy instance with either',
    'the preconfigured host and port or optionally replacing',
    'that with the ones given as an optional argument.',
    'It delegates traffic in proxy mode to the built-in http',
    'server (set by --http or configuration file).',
    'A self-signed certificate is generated, unless one is',
    'configured otherwise.',
    'If the host and port is omitted, uses the default one(s)',
    'configured. When given multiple times, runs nginx bound',
    'to several interfaces and ports.\n'
  ]).join('\n'),

  useMongo: optFormat(30, [`--use-mongo ${bold('url')}`,
    `Connects to the mongoDB at the configured ${bold('url')} rather than`,
    'the one(s) configured. The url format is the standard',
    'mongodb://user:auth@host:port/database\n'
  ]).join('\n'),

  runMongod: optFormat(30, [`--run-mongod ${bold('port')}`,
    'If used, runs a disposable mongod instance at the given',
    `${bold('port')} bound to ${bold('localhost')}. Overrides mongodb urls in`,
    'configuration file(s) as well as ones given in the',
    `${bold('--use-mongo')} option(s).\n`
  ]).join('\n'),

  useGearman: optFormat(30, [`--use-gearman ${bold('host')}:${bold('port')}`,
    `Connects to the gearmand at the configured ${bold('host')}:${bold('port')}`,
    'rather than the one(s) configured.\n',
  ]).join('\n'),

  runGearmand: optFormat(30, [`--run-gearmand ${bold('port')}`,
    'If used, runs a gearman instance at the given',
    `${bold('port')} bound to ${bold('localhost')}. Overrides gearman urls in`,
    'configuration file(s) as well as ones given in the',
    `${bold('--use-gearman')} option(s).\n`
  ]).join('\n'),

  resetSes: optFormat(30, ['--reset-sessions (-r)',
    'Clears all existing sessions and their values.\n'
  ]).join('\n'),

  latency: optFormat(30, [`--latency ${bold('ms')}`,
    'If used, adds the amount of milliseconds given to each',
    'response of the http server. Simulates laggy connections',
    'when developing locally or on high-speed networks. Useful',
    'for development and testing purposes.\n'
  ]).join('\n'),

  bandwidth: optFormat(30, [`--bandwidth ${bold('kBps')}`,
    'If used, adds a latency equivalent to the connection speed',
    'given in kilobytes per second to every response of the http',
    'server. Does not take into account parallel connections',
    'from the same client host, which means it can only be used',
    'as a general connection slowdown factor to estimate how an',
    'app behaves on limited bandwidth. Useful for development',
    'and testing purposes.\n'
  ]).join('\n'),

  say: optFormat(30, ['--say (-S)',
    'Uses speech synthesis for certain important server events,',
    'which may be useful in certain development situations when',
    'logs can’t be monitored visually.\n'
  ]).join('\n'),

  disableGzip: optFormat(30, ['--disable-gzip',
    'Disables gzip compression of http responses. Useful for',
    'saving a few CPU cycles at the cost of higher bandwidth',
    'usage.\n'
  ]).join('\n'),

  disableObfuscation: optFormat(30, ['--disable-obfuscation',
    'Disables mangling/obfuscation of built client resources.\n'],
    'Makes responses easier to read manually at the cost of',
    'higher bandwidth usage.\n'
  ).join('\n'),

  disableJsmin: optFormat(30, ['--disable-jsmin',
    'Disables minification of built client resources and',
    'JSON responses. Makes responses easier to read manually',
    'at the cost of higher bandwidth usage.\n'
  ]).join('\n'),

  buildReport: optFormat(30, ['--build-report',
    'Outputs verbose summaries of client resource build events.\n'
  ]).join('\n'),
};

module.exports = {

  argv: {
    unableToLoadPlugin: 'unable to load plugin:',

    cliParserError: 'command line argument parser error:',

    invalidCommand: cmd => {
      return `invalid command: ”${cmd}“, use “snab help” for usage`;
    }
  },

  help: {
    title: 'Shows usage of cli commands',

    noCommandGiven: `no command given, assuming “${bold('help')}”\n`,

    listHelpError: 'encountered error in command list:',

    cmdHelpError: 'encountered error in command help:',

    commandList: (name, title) => {
      return `  ${ljust(bold(name), 10)}${title}`;
    },

    invalidCmd: cmd => {
      return `no such command: “${cmd}”`;
    },

    usage: [
      `usage: snab help ${bold('command')}\n`,
      'Available commands:'
    ].join('\n'),

    furtherInfo:
      '\nFor further information, visit https://github.com/jammi/snab/'
  },

  run: {
    title: 'Runs tasks, stays in fg until done',

    usage: [
      `usage: snab run [options] ${bold('project_path')} [${bold('task1 task2 ...')}]\n`,
      // 'The “run” command starts snab processes and stays in',
      // 'the foreground (no daemonization).\n',
      // `The ${bold('project_path')} is the path to an snab`,
      // `project directory. Use a dot (${bold('.')}) if the project`,
      // 'directory is the current working directory.',
      // 'Exit by pressing CTRL-C.\n',
      // 'Available options (alternatives in parenthesis):\n',
      // runOptions.confFile,
      // runOptions.debug,
      // runOptions.verbose,
      // runOptions.autoUpdate,
      // runOptions.logFg,
      // runOptions.http,
      // runOptions.runNginx,
      // runOptions.useMongo,
      // runOptions.runMongod,
      // runOptions.useGearman,
      // runOptions.runGearmand,
      // runOptions.resetSes,
      // runOptions.latency,
      // runOptions.bandwidth,
      // runOptions.say,
      // runOptions.traceSes,
      // runOptions.traceDelegates,
      // runOptions.disableGzip,
      // runOptions.disableObfuscation,
      // runOptions.disableJsmin,
      // runOptions.buildReport,
    ].join('\n')
  },

  start: {
    title: 'Starts services, stays in fg until started',

    usage:
      `usage: snab start [options] ${bold('project_path')} [${bold('service1 service2 ...')}]\n`
  },

  stop: {
    title: 'Stops services, stays in fg until stopped',

    usage:
      `usage: snab stop [options] ${bold('project_path')} [${bold('service1 service2 ...')}]\n`
  },

  restart: {
    title: 'Restarts services, stays in fg until restarted',

    usage:
      `usage: snab restart [options] ${bold('project_path')} [${bold('service1 service2 ...')}]\n`
  },

  status: {
    title: 'Shows status of services, stays in fg until done',

    usage:
      `usage: snab status [options] ${bold('project_path')} [${bold('service1 service2 ...')}]\n`
  },

  version: {
    title: 'Shows version and exits',

    usage: [
      'usage: snab version\n',
      'The “version” command shows the snab version and exits.'
    ].join('\n')
  }
};
