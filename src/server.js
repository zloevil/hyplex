import express from 'express'
import GraphQL from 'express-graphql'
import applyMiddleware from './middlewares'
import GraphQLSchema from './schema/schema'

const app = express()

applyMiddleware(app)

// GraphQL
app.use('/api', GraphQL((req, res) => ({
  schema: GraphQLSchema,
  graphiql: process.env.NODE_ENV === 'development',
  context: { req, res },
})))

export default app
