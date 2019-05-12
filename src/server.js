import express from 'express'
import GraphQL from 'express-graphql'
import applyMiddleware from './middlewares'
import GraphQLSchema from './schema/schema'
import rabbit from './handlers/rabbit'
import { services } from './handlers/rabbit/config'

const app = express()

applyMiddleware(app)

// GraphQL
app.use('/api', GraphQL({
  schema: GraphQLSchema,
  graphiql: process.env.NODE_ENV === 'development',
}))

export default app

rabbit.sendMsg(services.mailer, {
  test: 'test',
})
