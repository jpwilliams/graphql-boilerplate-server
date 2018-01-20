module.exports = `
type Message {
  _id: String!
  createdBy: User
  createdAt: Date
  body: String!
  conversation: Conversation
}
`
