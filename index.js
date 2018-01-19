// imports
const { createServer } = require('http')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const express = require('express')
const cors = require('cors')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const { execute, subscribe } = require('graphql')
const { schema, loaders } = require('./lib/loader')
const bodyParser = require('body-parser')
const { getDb, ObjectId } = require('./lib/singletons/mongo')
const { pubsub } = require('./lib/singletons/pubsub')

// config
const isProd = Boolean(process.env.NODE_ENV === 'production')
const port = process.env.PORT || 4000

// set up API
const api = express()
api.use(cors())

api.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

  return next()
})

// set up GraphQL endpoint
api.use('/graphql', bodyParser.json(), graphqlExpress(async (req, res) => {
  // the context object contains anything you'd like your
  // resolvers to have access to.
  //
  // here we add loaders, a MongoDB connection, an ObjectId
  // helper and pubsub, used for Subscriptions.
  //
  // add anything here that you need in multiple resolvers
  const context = {
    db: await getDb('base'),
    ObjectId,
    pubsub
  }

  context.loaders = Object.keys(loaders).reduce((map, key) => {
    map[key] = loaders[key](context)

    return map
  }, {})

  return {
    schema: schema,
    context
  }
}))

// set up GraphiQL if not in production
if (!isProd) {
  api.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`
  }))
}

// boot the servers
const graphQLServer = createServer(api)

graphQLServer.listen(port, () => {
  console.log(`GraphQL Server is now running on http://localhost:${port}/graphql`)
  console.log(`GraphQL Subscriptions are now running on ws://localhost:${port}/subscriptions`)
  console.log(`GraphiQL Server is now running on http://localhost:${port}/graphiql`)
})

// boot a subscriptions server
SubscriptionServer.create({
  schema,
  execute,
  subscribe,
  onOperation: async (_message, params, _webSocket) => {
    const context = {
      db: await getDb('base'),
      ObjectId,
      pubsub
    }

    context.loaders = Object.keys(loaders).reduce((map, key) => {
      map[key] = loaders[key](context)

      return map
    }, {})

    return { ...params, context }
  }
}, {
  server: graphQLServer,
  path: '/subscriptions'
})
