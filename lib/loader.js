const debug = require('debug')('api:loading')
const { join } = require('path')
const { makeExecutableSchema } = require('graphql-tools')
const microloader = require('microloader')
const sharedResolvers = ['Query', 'Mutation', 'Subscription']
const typesToAddMap = {}
const targetPath = join(__dirname, '../types')

const types = microloader(
  targetPath,
  { objectify: true, cwd: targetPath }
)

const { typeDefs, resolvers, loaders } = Object.keys(types).reduce((x, typeKey) => {
  const {
    schema,
    resolvers,
    loaders
  } = types[typeKey]

  if (schema) {
    debug(`'${typeKey}' type`)
    x.typeDefs.push(`\n${schema}\n`)
  }

  if (resolvers) {
    debug(`'${typeKey}' resolvers`)
    x.resolvers[typeKey] = x.resolvers[typeKey] || {}

    Object.keys(resolvers).forEach((resolverKey) => {
      if (typeof resolvers[resolverKey] === 'function') {
        Object.defineProperty(
          resolvers[resolverKey],
          'name',
          { value: `Resolver_${typeKey}_${resolverKey}` }
        )
      }
    })

    Object.assign(x.resolvers[typeKey], resolvers)
  }

  if (loaders) {
    debug(`'${typeKey}' loaders`)

    Object.keys(loaders).forEach((loaderKey) => {
      debug(`\t - ${loaderKey}`)
    })

    Object.assign(x.loaders, loaders)
  }

  sharedResolvers.forEach((item) => {
    const target = types[typeKey][item]

    if (!target) return
    const keys = Object.keys(target)

    keys.forEach((key) => {
      if (!target[key].schema && !target[key].resolver) return

      debug(`'${key}' ${item.toLowerCase()} (from '${typeKey}')`)

      typesToAddMap[item] = true

      if (target[key].schema) {
        x.typeDefs.push(`\n${target[key].schema}\n`)
      }

      if (target[key].resolver) {
        Object.defineProperty(
          target[key].resolver,
          'name',
          { value: `${item}_${typeKey}_${key}` }
        )

        x.resolvers[item] = x.resolvers[item] || {}
        x.resolvers[item][key] = target[key].resolver
      }
    })
  })

  return x
}, {
  typeDefs: [],
  resolvers: {},
  loaders: {}
})

const logger = {
  log: console.log
}

let BaseTypeDefs = '\n'
const typesToAdd = Object.keys(typesToAddMap)

typesToAdd.forEach((type) => {
  BaseTypeDefs += `type ${type}\n`
})

BaseTypeDefs += 'schema {\n'

typesToAdd.forEach((type) => {
  BaseTypeDefs += `  ${type.toLowerCase()}: ${type}\n`
})

BaseTypeDefs += '}\n'

typeDefs.push(BaseTypeDefs)

exports.schema = makeExecutableSchema({ typeDefs, resolvers, logger })
exports.loaders = loaders
