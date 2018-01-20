exports.schema = `
extend type Mutation {
  createMessage(input: CreateMessageInput!): CreateMessageOutput
}

input CreateMessageInput {
  conversationId: String!
  body: String!
}

type CreateMessageOutput {
  message: Message
}
`

exports.resolver = async (
  _obj,
  { conversationId, body },
  { db, ObjectId, pubsub, user, middleware },
  _info
) => {
  await middleware.isAuthenticated()
  await middleware.hasAccessToConversation(conversationId)
}
