const fs = require('fs');
const path = require('path');
const {err, log, warn} = require('../util/log')('snab:argv-parser');

module.exports = (runMode, argv) => {

  const setTrue = optionNames => {
    if (!(optionNames instanceof(Array))) {
      optionNames = [optionNames];
    }
    return () => {
      optionNames.forEach(optionName => {
        runMode[optionName] = true;
      });
    };
  };

  const modeSet = {
    debug: setTrue(
      'debug', 'verbose', 'autoUpdate', 'logFg', 'disableGzip',
      'disableObfuscation', 'disableJsmin', 'buildReport'
    ),
    verbose: setTrue('verbose'),
    autoUpdate: setTrue('autoUpdate'),
    logFg: setTrue('logFg'),
    traceSes: setTrue('traceSes'),
    traceDelegates: setTrue('traceDelegates'),
    resetSes: setTrue('resetSes'),
    say: setTrue('say'),
    disableGzip: setTrue('disableGzip'),
    disableObfuscation: setTrue('disableObfuscation'),
    disableJsmin: setTrue('disableJsmin'),
    buildReport: setTrue('buildReport'),
    confFile: arg => {
      const filePath = path.resolve(runMode.cwd, arg);
      if (fs.existsSync(filePath)) {
        runMode.confFiles.push(filePath);
      }
      else {
        err(`Configuration file ${filePath} does not exist!`);
      }
    },
    latency: ms => {
      runMode.latency = ms;
    },
    bandwidth: kbps => {
      runMode.bandwidth = kbps;
    },
    runMongod: port => {
      runMode.runMongod = {
        host: '127.0.0.1',
        port: port,
        db: 'snab'
      };
      runMode.mongo = `mongodb://127.0.0.1:${port}/snab`;
    },
    runGearmand: port => {
      runMode.runGearmand = {
        host: '127.0.0.1',
        port: port
      };
      runMode.gearman = {
        host: '127.0.0.1',
        port: port
      };
    },
    http: (host, port) => {
      runMode.http.push({host, port});
    },
    nginx: (host, port) => {
      runMode.nginx.push({host, port});
    },
    gearman: (host, port) => {
      runMode.gearman = {host, port};
    },
    mongo: url => {
      runMode.mongo = url;
    },
    // aliases:
    'd': 'debug',
    'v': 'verbose',
    'a': 'autoUpdate',
    'f': 'logFg',
    'reset-sessions': 'resetSes',
    'r': 'resetSes',
    'S': 'say',
    'use-gearman': 'gearman',
    'use-mongo': 'mongo',
    'conf': 'confFile',
    // expects value by validation type:
    validation: {
      numeric: ['latency', 'bandwidth', 'runMongod', 'runGearmand'],
      file: ['confFile'],
      hostPort: ['http', 'nginx', 'gearman'],
      url: ['mongo'],
      any: []
    }
  };

  for (const key in modeSet.validation) {
    if (key !== 'any') {
      modeSet.validation[key].forEach(fName => {
        modeSet.validation.any.push(fName);
      });
    }
  }

  const validProject = projPath => {
    const fullPath = path.resolve(runMode.cwd, projPath);
    warn('project path validation is not completed yet!');
    return fs.existsSync(fullPath);
  };

  const resolveSetterName = name => {
    if (typeof modeSet[name] === 'function') {
      return name;
    }
    else if (typeof modeSet[name] === 'string') {
      if (typeof modeSet[modeSet[name]] === 'function') {
        return modeSet[name];
      }
    }
    return false;
  };

  const valueSetter = (name, val, errMsg) => {
    const fn = modeSet[name];
    if (modeSet.validation.any.includes(name) && !val) {
      return true;
    }
    else if (typeof fn === 'function') {
      if (val) {
        fn.apply(null, val);
      }
      else {
        fn();
      }
      return false;
    }
    else {
      err(errMsg);
      return false;
    }
  };

  const parseRunArgs = () => {
    let expectValue = false;
    let optionName = null;
    argv.forEach(arg => {
      if (expectValue) {
        const isNumericValue = parseInt(arg, 10).toString() === arg;
        const isHostPortValue = arg.match(/([^\:]+):([0-9]+?)$/);
        if (modeSet.validation.file.includes(optionName)) {
          valueSetter(optionName, [arg],
            `Invalid path value for opton '${optionName}': "${arg}"`);
        }
        else if (modeSet.validation.numeric.includes(optionName) && isNumericValue) {
          const value = parseInt(arg, 10);
          valueSetter(optionName, [value],
            `Invalid numeric value for option '${optionName}': "${arg}"`);
        }
        else if (modeSet.validation.hostPort.includes(optionName) && isHostPortValue) {
          const host = isHostPortValue[1];
          const port = parseInt(isHostPortValue[2], 10);
          valueSetter(optionName, [host, port],
            `Invalid host:port value for option '${optionName}': "${arg}"`);
        }
        else if (modeSet.validation.url.includes(optionName)) {
          valueSetter(optionName, [arg],
            `Invalid url value for option '${optionName}': "${arg}"`);
        }
        else if (modeSet.validation.any.includes(optionName)) {
          valueSetter(optionName, [arg],
            `Invalid generic value for option '${optionName}': "${arg}"`);
        }
        else {
          err(`Invalid value or option '${optionName}': "${arg}"`);
        }
        expectValue = false;
      }
      else if (arg.startsWith('--')) {
        optionName = resolveSetterName(arg.slice(2));
        expectValue = valueSetter(optionName, null, `Invalid option: '${arg}'`);
      }
      else if (arg.startsWith('-')) {
        arg.slice(1).split('').forEach(a => {
          valueSetter(resolveSetterName(a), null, `Invalid switch: '${a}' in '${arg}'`);
        });
      }
      else if (runMode.projectPath) {
        runMode.extraArgs.push(arg);
      }
      else if (validProject(arg)) {
        runMode.projectPath = path.resolve(runMode.cwd, arg);
      }
      else {
        err('Invalid argument:', arg);
      }
    });
    if (expectValue) {
      err(`Missing value for option '${optionName}'`);
    }
    // log('runMode:', runMode);
  };
  return {parseRunArgs};
};
