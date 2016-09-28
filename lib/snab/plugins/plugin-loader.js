const fs = require('fs');
const path = require('path');

module.exports = (pluginPaths, api, reqFns = []) => {

  if (typeof pluginPaths === 'string') {
    pluginPaths = [pluginPaths];
  }

  if (!reqFns.includes('init')) {
    reqFns.unshift('init');
  }

  const list = () =>
    new Promise((resolve, reject) =>
      pluginPaths
        .filter(pluginPath => pluginPath && fs.existsSync(pluginPath))
        .map(pluginPath =>
          fs.readdir(pluginPath, (err, entries) => {
            if (err) {reject(err);}
            resolve(entries
              .filter(entry => ['.js'].includes(path.extname(entry)))
              .map(entry => {
                const fullPath = path.resolve(pluginPath, entry);
                const ext = path.extname(entry);
                const name = path.basename(entry, ext);
                return {
                  fullPath,
                  name,
                  ext: ext.slice(1),
                  stat: fs.statSync(fullPath)
                };
              })
              .sort((a, b) => (a.name > b.name) ? 1 : -1)
            );
          }
        )
      )
    );

  const findPlugin = name =>
    list().then(plugInfos =>
      plugInfos.filter(plugInfo => plugInfo.name === name)
    );

  const hasPlugin = name =>
    findPlugin(name).then(matched => matched.length === 1);

  const load = name =>
    findPlugin(name).then(([plugInfo]) => {
      const mod = require(plugInfo.fullPath);
      if (typeof mod !== 'function') {
        throw new Error(`module "${name}" is not a function`);
      }
      const plug = mod(api);
      reqFns.forEach(reqFn => {
        if (typeof plug[reqFn] !== 'function') {
          throw new Error(`plugin "${name}" does not have an "${reqFn}" function`);
        }
      });
      plug.info = plugInfo;
      plug.init();
      return plug;
    });

  const loadAll = () =>
    list().then(plugInfos =>
      Promise.all(
        plugInfos.map(info => load(info.name))
      )
    );

  return {findPlugin, hasPlugin, list, load, loadAll};
};
