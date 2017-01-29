const feathers = require('feathers');
const bodyParser = require('body-parser');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');

if (typeof(localStorage) === 'undefined') {
  // dev/test use only
  var LocalStorage = require('node-localstorage').LocalStorage;
  global.localStorage = new LocalStorage('./test-localStorage');
}

const service = require('../src');
const todosMapper = require('./todos.mapper')()

// Create a feathers instance.
const app = feathers()
  // Enable REST services
  .configure(rest())
  // Enable Socket.io services
  .configure(socketio())
  // Turn on JSON parser for REST services
  .use(bodyParser.json())
  // Turn on URL-encoded parser for REST services
  .use(bodyParser.urlencoded({ extended: true }));

// Use a Js-data mapper with the service, see: http://www.js-data.io/v3.0/docs/
app.use('/todos', service({ mapper: todosMapper }));

// Start the server
module.exports = app.listen(3030);

console.log('Feathers Todos JsData service running on 127.0.0.1:3030');
