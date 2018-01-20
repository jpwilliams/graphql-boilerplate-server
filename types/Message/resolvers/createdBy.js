module.exports = async ({ createdBy }, _args, { loaders }) => {
  return createdBy && loaders.usersById.load(createdBy.toString())
}
