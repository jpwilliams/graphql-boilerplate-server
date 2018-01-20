module.exports = context => async (conversationId) => {
  const { db, ObjectId } = context

  if (!conversationId) {
    throw new Error('Conversation with that ID not found.')
  }

  return db
    .collection('conversation')
    .find({_id: ObjectId(conversationId)}, {limit: 1})
    .hasNext()
}
