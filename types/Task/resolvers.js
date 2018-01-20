module.exports = {
  parentTask: async ({ parentTask }, _args, { loaders }) => {
    return parentTask && loaders.tasksById.load(parentTask.toString())
  },

  subTasks: async ({ _id }, _args, { loaders }) => {
    return loaders.tasksWithParentId.load(_id.toString())
  }
}
