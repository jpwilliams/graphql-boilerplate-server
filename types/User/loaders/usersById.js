const DataLoader = require('dataloader')

module.exports = ({ db, ObjectId }) => new DataLoader(async (userIds) => {
  const users = await db
    .collection('user')
    .find({_id: {$in: userIds.map(ObjectId)}})
    .toArray()

  const userMap = users.reduce((map, user) => {
    map[user._id.toString()] = user

    return map
  }, {})

  return userIds.map(userId => userMap[userId])
})
