const DataLoader = require('dataloader')

module.exports = ({ db, ObjectId }) => new DataLoader(async (conversationIds) => {
  const conversations = await db
    .collection('conversation')
    .find({_id: {$in: conversationIds.map(ObjectId)}})
    .toArray()

  const conversationMap = conversations.reduce((map, conversation) => {
    map[conversation._id.toString()] = conversation

    return map
  }, {})

  return conversationIds.map(conversationId => conversationMap[conversationId])
})
