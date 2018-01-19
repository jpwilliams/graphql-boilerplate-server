exports.schema = `
extend type Mutation {
  createTask(input: CreateTaskInput): CreateTaskOutput
}

input CreateTaskInput {
  name: String!
  parentTask: String
}

type CreateTaskOutput {
  task: Task
}
`

exports.resolver = async (_root, { input }, { db, ObjectId, pubsub }, _info) => {
  if (input.parentTask) input.parentTask = ObjectId(input.parentTask)

  const result = await db
    .collection('task')
    .insertOne(input)

  const ret = { task: result.ops[0] }
  pubsub.publish('taskCreated', { taskCreated: ret })

  return ret
}
