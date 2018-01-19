const { RedisPubSub } = require('graphql-redis-subscriptions')

exports.pubsub = new RedisPubSub()
