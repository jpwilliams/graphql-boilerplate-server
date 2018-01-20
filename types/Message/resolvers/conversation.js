module.exports = async ({ conversation }, _args, { loaders }) => {
  return conversation && loaders.conversationsById.load(conversation.toString())
}
