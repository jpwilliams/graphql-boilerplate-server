// core libs
const url = require('url')

// public libs
const mongodb = require('mongodb')
const { ulid } = require('ulid')

const defaultDbUrl = process.env.DB_URL || 'mongodb://localhost:27017'
const dbs = {}

exports.getDb = async function getDb (input) {
  if (typeof input === 'string') input = { db: input }
  if (!input.db) throw new Error('A DB name or URL must be specified to connect to')
  if (!input.unique && dbs[input.db]) return dbs[input.db]

  if (input.options && typeof input.options !== 'object') {
    throw new Error('options must be an object if provided')
  }

  input.options = input.options || {}

  if (!input.options.hasOwnProperty('autoReconnect')) input.options.autoReconnect = true
  if (!input.options.hasOwnProperty('bufferMaxEntries')) input.options.bufferMaxEntries = 0
  if (!input.options.hasOwnProperty('poolSize')) input.options.poolSize = 32

  const isFullUrl = input.db.match(/^mongodb:\/\//)
  let dbUrl

  if (isFullUrl) {
    dbUrl = input.db
  } else {
    const unparsedUrl = isFullUrl ? input.db : defaultDbUrl
    const parsedUrl = url.parse(unparsedUrl)
    parsedUrl.pathname = `/${input.db}`
    dbUrl = url.format(parsedUrl)
  }

  const dbTag = input.unique ? `${input.db}-${ulid()}` : input.db

  dbs[dbTag] = mongodb
    .MongoClient
    .connect(dbUrl, input.options)
    .then((client) => {
      return client.db(input.db)
    })

  return dbs[dbTag]
}

exports.ObjectId = exports.ObjectID = mongodb.ObjectId
