# feathers-js-data
A Feathers.js service for JS-Data.js

------

<img src="https://raw.githubusercontent.com/js-data/js-data/master/js-data.png" alt="js-data logo" title="js-data" height="100" />
<img height="100" src="http://feathersjs.com/img/feathers-logo-wide.png" alt="Feathers logo">


------

# Build

```
npm i -S feathers-js-data
```

This service is for use on a Feathers.js server to compliment a client Js-Data
application.

### Js-Data container setup

> This is only an example. You can of course use any js-data adapter you want on
your backend. You can also reuse js-data Container, Adapter, & Mapper configs
between your client build and feathers server, if you want.

```js
// /js-data-container.js

const jsdata = require('js-data');
const MongoDBAdapter = require('js-data-mongodb').MongoDBAdapter;

module.exports = (() => {
  const container = new jsdata.Container({
    mapperDefaults: {
      idAttribute: '_id'
    }
  })

  const adapter = new MongoDBAdapter({
    uri: 'mongodb://localhost:27017/dev'
  })

  container.registerAdapter('mongodb', adapter, { default: true })

  return container
})()
```


### Feathers service setup

> Add you service in the feathers app, example config using a js-data container

```js
// services/todos/index.js

const container = require('../../js-data-container')
const service = require('feathers-js-data')

module.exports = function(){
  const app = this;

  // setup our js-data Mapper
  // http://www.js-data.io/v3.0/docs/modeling-your-data#define-mappers
  const mapper = container.defineMapper('todos')

  // the feathers-js-data service expects a js-data Mapper { mapper: new Mapper() }
  app.use('/todos', service({ mapper }));
};

```
