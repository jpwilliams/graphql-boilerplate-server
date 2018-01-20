module.exports = `
type Group {
  _id: String!
  uri: String!
  name: String!
  conversations: [Conversation]!
  domain: Domain!
}
`
