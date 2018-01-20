module.exports = async ({ parentTask }, _args, { loaders }) => {
  return parentTask && loaders.tasksById.load(parentTask.toString())
}
