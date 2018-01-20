module.exports = `
type Conversation {
  _id: String!
  name: String!
  description: String
  groups: [Group]!
  createdAt: Date!
  createdBy: User!
}
`
