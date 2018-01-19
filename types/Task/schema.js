module.exports = `
# A generic task.
type Task {
  _id: String!
  # Display name for task.
  name: String!
  # A short description of the task.
  description: String
  # When the task was created.
  createdAt: Date!
  # The parent of this task.
  parentTask: Task
  # Any subtasks (tasks with this task as a parent)
  subTasks: [Task]
}
`
