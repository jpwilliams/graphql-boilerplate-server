module.exports = `
type User {
  _id: String!
  uri: String!
  name: String!
  bio: String
  domains: [Domain]!
}
`
