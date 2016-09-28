const stripAnsi = require('strip-ansi');

module.exports = {
  ljust: (str, len, padding = ' ') => {
    if (stripAnsi(str).length === len) {
      return str;
    }
    else if (stripAnsi(str).length > len) {
      return stripAnsi(str).substring(0, len);
    }
    else {
      return str + padding.repeat(len - stripAnsi(str).length);
    }
  }
};
