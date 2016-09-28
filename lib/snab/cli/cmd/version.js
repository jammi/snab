const texts = require('snab/cli/texts').version;

module.exports = api => {
  return {
    init: () => {},
    run: () => {
      console.log(api.version);
    },
    help: detail => {
      return detail ? texts.usage : texts.title;
    }
  };
};
