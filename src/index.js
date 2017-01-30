class Service {
  constructor(options) {
    if (!options.mapper || !Object.keys(options.mapper.getAdapters() || {}).length) {
      throw new Error('You must pass in a js-data mapper with a registered adapter.',
        JSON.stringify(options, null, 2))
    } else {
      this.store = options.mapper
    }
  }

  _sanitizeQuery(query) {
    if (query && typeof query.where === 'string') {
      try {
        query.where = JSON.parse(query.where)
      } catch (e) {}
    }
    return query
  }

  get(id, params) {
    if (!id) {
      return Promise.reject('no id specified.')
    }

    return this.store.find(id)
  }

  find({ query }) {
    return this.store.findAll(query)
  }

  create(data, params) {
    if (Array.isArray(data)) {
        return this.store.createMany(data)
    }

    return this.store.create(data)
  }

  update(id, data, params) {
    // remove id attr - ie: mongoDB ObjectID/string issues
    if (data && data[this.store.idAttribute]) {
      delete data[this.store.idAttribute]
    }

    if (id) {
      return this.store.update(id, data)
    }

    return this.store.updateAll(this._sanitizeQuery(params.query) || {}, data)
  }

  patch(...params) {
    return this.update(...params)
  }

  remove(id, params) {
    if (id) {
      return this.store.find(id).then(record => this.store.destroy(id).then(() => record))
    }

    let sanitizedQuery = this._sanitizeQuery(params.query)

    return this.store.findAll(sanitizedQuery).then(records => {
      return this.store.destroyAll(sanitizedQuery).then(() => records)
    })
  }
}

function init (options) {
  return new Service(options);
}

init.Service = Service;

module.exports = init
