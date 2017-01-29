import { example } from 'feathers-service-tests';
import assert from 'assert';
// we make this available for the js-data-localstorage adapater
// Testing use only
var LocalStorage = require('node-localstorage').LocalStorage;
global.localStorage = new LocalStorage('./test-localStorage');
const server = require('../example/app');

// Setup our js-data sudo-client to test agains our js-data backend service
import { Container } from 'js-data';
import { HttpAdapter } from 'js-data-http-node';
const httpAdapter = new HttpAdapter({
	basePath: 'http://127.0.0.1:3030'
});
const store = new Container();
store.registerAdapter('http', httpAdapter, { 'default': true });
const todos = store.defineMapper('todos');

describe('JsData client to JsData backend service CRUD tests', () => {
  it('create a record', done => {
    todos.create({ text: 'todo text' })
      .then(record => {
        assert.equal(record.text, 'todo text')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

	it('create many records', done => {
    todos.createMany([{ text: 'todo text' },{ text: 'another test todo'}])
      .then(records => {
        assert.equal(records.length, 2)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('find a record', done => {
    todos.create({ text: 'todo text' })
      .then(record => {
        return todos.find(record.id)
      })
      .then(record => {
        assert.equal(record.text, 'todo text')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('update a record', done => {
    todos.create({ text: 'update test' })
      .then(record => {
        assert.equal(record.text, 'update test')
        return todos.update(record.id, { text: 'updated'})
      })
      .then(updatedRecord => {
        assert.equal(updatedRecord.text, 'updated')
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('destroy a record', done => {
    let _id

    todos.create({ text: 'test todo' })
      .then(record => {
        assert.equal(record.text, 'test todo')
        _id = record.id
        return todos.destroy(_id)
      })
      .then(destroyed => {
        assert.equal(destroyed.id, _id)
        done()
      })
      .catch(err => {
        done(err)
      })
  })

  it('destroy many records', done => {
    let _id1, _id2

    todos.createMany([{ text: 'test1' },{ text: 'test2' }])
      .then(record => {
				assert.equal(record[0].text, 'test1')
				assert.equal(record[1].text, 'test2')

        _id1 = record[0].id
        _id2 = record[1].id

        return todos.destroyAll({ where: { id: { in: [_id1, _id2] }}})
      })
      .then(destroyed => {
				assert.equal(destroyed.length, 2)
        assert.equal(destroyed[0].id, _id1)
        assert.equal(destroyed[1].id, _id2)
        done()
      })
      .catch(done)
  })
});

// describe('feathers-service-tests CRUD ops', () => {
//   after(done => server.close(() => done()));
//
//   example();
// });
