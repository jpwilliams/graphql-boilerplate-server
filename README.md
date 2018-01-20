# GraphQL Server Boilerplate

A quick-and-easy GraphQL boilerplate that automatically loads your GraphQL types, made for easy, scalable building.

# Usage

First, you need to have these running on default ports:

- MongoDB
- Redis

Then...

``` sh
yarn
yarn start
```

If all went well, you should get:

``` sh
GraphQL Server is now running on http://localhost:4000/graphql
GraphQL Subscriptions are now running on ws://localhost:4000/subscriptions
GraphiQL Server is now running on http://localhost:4000/graphiql
```

Head on over to [http://localhost:4000/graphiql](http://localhost:4000/graphiql) for the interactive experience!

# Features

- GraphiQL IDE for development
- Context-aware middleware
- Support for Data Loaders
- MongoDB singleton
- Easy addition/removal of types, queries, mutations and subscriptions
- Can add types as a single file or split them out into multiple files/folders; the loader takes care of putting everything in the right place (_I'll put in an example for this_)
- Redis pubsub subscriptions built in
- ...

# Adding stuff

All types, resolvers and loaders can be found within the `types` folder.

Within that, you have folders for the individual types and they come with a folder structure of their own. There's a `Task` type there by default; let's look at that.

```
Task
├── Query
│   ├── task.js
│   └── tasks.js
├── Mutation
│   └── createTask.js
├── Subscription
│   └── taskCreated.js
├── loaders
│   ├── tasksById.js
│   └── tasksWithParentId.js
├── resolvers.js
└── schema.js
```

It's a good idea to check out each file as we go through.

- [`schema.js`](#) Exports a string defining the GraphQL schema for the type you're creating.
- [`resolvers.js`](#) Exports an object of resolvers used to resolve fields on the type.
- [`Query/`](#) Contains any queries related to this type.
  - [`tasks.js`](#) Creates a query named `tasks`. Exports an object containing a `schema` and `resolver` for the query. The schema *must* `extend` the `Query` type.
- [`Mutation/`](#) Contains any mutations related to this type.
  - [`createTask.js`](#) Creates a mutation named `createTask`. Exports an object containing a `schema` and `resolver` for the mutation. The schema *must* `extend` the `Mutation` type.
- [`Subscription/`](#) Contains any subscriptions related to this type.
  - [`taskCreated.js`](#) Creates a subscription named `taskCreated`. Exports an object containing a `schema` and `resolver` for the query. The schema *must* `extend` the `Subscription` type.
- [`loaders/`](#) Contains any [`dataloader`s](https://github.com/facebook/dataloader) related to this type. Any loaders added here are available to all resolvers in the `context` object.
  - [`tasksById.js`](#) Adds a loader named `tasksById`. *The name of the file dictates the name of the loader.* Exports a `loader` function which receives a `context` object and must pass back a `DataLoader` instance. The use of a wrapping function here allows loaders to use `context`, but also means you can combat [`dataloader`'s caching trap](https://github.com/facebook/dataloader#caching-per-request) by returning a new loader on each run.
