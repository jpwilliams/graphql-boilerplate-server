const DataLoader = require('dataloader')

module.exports = ({ db, ObjectId }) => new DataLoader(async (taskIds) => {
  const tasks = await db
    .collection('task')
    .find({
      _id: { $in: taskIds.map(ObjectId) }
    })
    .toArray()

  const taskMap = tasks.reduce((map, task) => {
    map[task._id.toString()] = task

    return map
  }, {})

  return taskIds.map(taskId => taskMap[taskId])
})
