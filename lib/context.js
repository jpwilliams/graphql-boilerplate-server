// imports
const { join } = require('path')
const microloader = require('microloader')
const { loaders } = require('./loader')
const { getDb, ObjectId } = require('./singletons/mongo')
const { pubsub } = require('./singletons/pubsub')
const middlewarePath = join(__dirname, './middleware')

const middleware = microloader(middlewarePath, {
  objectify: true,
  cwd: middlewarePath
})

// config
const loaderKeys = Object.keys(loaders)
const middlewareKeys = Object.keys(middleware)

exports.getContext = async function getContext (input = {}) {
  const context = {
    ...input,
    db: await getDb('base'),
    ObjectId,
    pubsub
  }

  context.middleware = middlewareKeys.reduce((map, key) => {
    map[key] = middleware[key](context)

    return map
  }, {})

  context.loaders = loaderKeys.reduce((map, key) => {
    map[key] = loaders[key](context)

    return map
  }, {})

  return context
}
