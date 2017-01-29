const container = require('./js-data.container')();

function init() {
  // setup a js-data mapper for testing use
  const mapper = container.defineMapper('todos');
  return mapper
}

module.exports = init;
