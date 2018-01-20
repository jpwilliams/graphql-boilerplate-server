exports.schema = `
extend type Query {
  messages(input: MessagesInput!): MessagesOutput
}

input MessagesInput {
  conversationId: String!
  first: Int
  last: Int
  after: String
  before: String
}

type MessagesOutput {
  messages: [Message]!
  info: MessagesPageInfo!
}

type MessagesPageInfo {
  endCursor: String
  hasNextPage: Boolean!
}
`

exports.resolver = async (_obj, { input }, context, _info) => {
  const ret = {messages: [], info: {hasNextPage: false}}
  const options = {}

  const originalLimit = Math.min(
    100,
    Math.max(0, input.first || 0, input.last || 0)
  )

  if (originalLimit < 1) return ret
  options.limit = originalLimit + 1

  const query = {
    conversation: context.ObjectId(input.conversationId)
  }

  options.sort = [['_id', input.first ? 1 : -1]]

  const messages = await context.db
    .collection('message')
    .find(query, options)
    .toArray()

  if (messages.length) {
    ret.info.endCursor = messages[messages.length - 2]._id.toString()
    if (messages.length === options.limit) ret.info.hasNextPage = true
    ret.messages = messages
  }

  return ret
}
