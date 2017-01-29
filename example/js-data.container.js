const jsdata = require('js-data');
const DSLocalStorageAdapter = require('js-data-localstorage');

function init() {
  // setup a js-data container for testing use
  const container = new jsdata.Container();
  const adapter = new DSLocalStorageAdapter();
  container.registerAdapter('localstorage', adapter, { default: true });
  return container
}

module.exports = init;
