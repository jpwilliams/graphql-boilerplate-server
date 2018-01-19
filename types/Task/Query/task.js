exports.schema = `
extend type Query {
  # List all domains in the entirety of Wildfire.
  # Sort of just serves as a silly test endpoint
  # for now.
  task(_id: String!): Task
}
`

exports.resolver = async (_root, { _id }, { db, ObjectId }) => {
  return db
    .collection('task')
    .findOne({ _id: ObjectId(_id) })
}
