exports.schema = `
extend type Query {
  # List all domains in the entirety of Wildfire.
  # Sort of just serves as a silly test endpoint
  # for now.
  tasks: [Task]
}
`

exports.resolver = async (_root, _args, { db }) => {
  return db
    .collection('task')
    .find()
    .toArray()
}
