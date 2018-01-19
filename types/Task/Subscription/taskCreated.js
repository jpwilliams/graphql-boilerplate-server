exports.schema = `
extend type Subscription {
  taskCreated: TaskCreatedPayload
}

type TaskCreatedPayload {
  task: Task
}
`

exports.resolver = {
  subscribe: (_root, _args, { pubsub }) => {
    return pubsub.asyncIterator('taskCreated')
  }
}
