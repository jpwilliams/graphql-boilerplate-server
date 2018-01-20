module.exports = context => async () => {
  if (!context.user) {
    throw new Error('You must be logged in to perform this action.')
  }
}
