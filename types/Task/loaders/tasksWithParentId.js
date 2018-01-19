const DataLoader = require('dataloader')

module.exports = ({ db, ObjectId }) => new DataLoader(async (parentIds) => {
  const ops = parentIds.map((parentId) => {
    return db
      .collection('task')
      .find({ parentTask: ObjectId(parentId) })
      .toArray()
  })

  return Promise.all(ops)
})
