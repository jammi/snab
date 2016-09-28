const emojic = require('emojic');
const chalk = require('chalk');

const argsToArr = args => {
  const arr = [];
  for (let i = 0; i < args.length; i++) {
    arr.push(args[i]);
  }
  return arr;
};

const base36Time = () =>
  Math.floor(new Date().getTime() * 1000).toString(36);

module.exports = (prefix = 'snab', icons = true, time = true, color = true) => {
  return {
    err: function() {
      const args = argsToArr(arguments);
      if (color) {
        args.unshift(chalk.red(prefix));
      }
      else {
        args.unshift(prefix);
      }
      if (icons) {
        args.unshift(emojic.x);
      }
      if (time) {
        args.unshift(base36Time());
      }
      console.error.apply(console.error, args);
    },
    echo: function() {
      const args = argsToArr(arguments);
      console.log.apply(console.log, args);
    },
    log: function() {
      const args = argsToArr(arguments);
      if (color) {
        args.unshift(chalk.white(prefix));
      }
      else {
        args.unshift(prefix);
      }
      if (icons) {
        args.unshift(emojic.star);
      }
      if (time) {
        args.unshift(base36Time());
      }
      console.log.apply(console.log, args);
    },
    warn: function() {
      const args = argsToArr(arguments);
      if (color) {
        args.unshift(chalk.yellow(prefix));
      }
      else {
        args.unshift(prefix);
      }
      if (icons) {
        args.unshift(emojic.warning);
      }
      if (time) {
        args.unshift(base36Time());
      }
      console.warn.apply(console.warn, args);
    }
  };
};
