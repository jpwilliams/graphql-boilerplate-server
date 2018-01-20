// imports
const microloader = require('microloader')
const { join } = require('path')
const { createServer } = require('http')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const express = require('express')
const cors = require('cors')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')
const { execute, subscribe } = require('graphql')
const { schema } = require('./lib/loader')
const bodyParser = require('body-parser')
const { getContext } = require('./lib/context')
const { firebase } = require('./lib/singletons/firebase')

// config
const configPath = join(__dirname, 'config')

const config = microloader(
  configPath,
  {objectify: true, cwd: configPath}
)

// set up API
const api = express()
api.use(cors())

api.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')

  return next()
})

api.use(async (req, res, next) => {
  // const authHeader = req.header('Authorization')
  // if (!authHeader) return next()

  // const idToken = authHeader.split(' ').pop()
  const idToken = config.devIdToken

  // const user = await firebase
  //   .auth()
  //   .verifyIdToken(idToken)

  let user = null
  user = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64'))

  if (user) {
    res.locals.user = user
  }

  return next()
})

// set up GraphQL endpoint
api.use('/graphql', bodyParser.json(), graphqlExpress(async (req, res) => {
  return {
    schema: schema,
    context: await getContext({
      user: res.locals.user
    })
  }
}))

// set up GraphiQL if not in production
if (!config.isProd) {
  api.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    subscriptionsEndpoint: `ws://localhost:${config.port}/subscriptions`
  }))
}

// boot the servers
const graphQLServer = createServer(api)

graphQLServer.listen(config.port, () => {
  console.log(`GraphQL Server is now running on http://localhost:${config.port}/graphql`)
  console.log(`GraphQL Subscriptions are now running on ws://localhost:${config.port}/subscriptions`)
  console.log(`GraphiQL Server is now running on http://localhost:${config.port}/graphiql`)
})

// boot a subscriptions server
SubscriptionServer.create({
  schema,
  execute,
  subscribe,
  onOperation: async (_message, params, _webSocket) => {
    return {
      ...params,
      context: await getContext()
    }
  }
}, {
  server: graphQLServer,
  path: '/subscriptions'
})
