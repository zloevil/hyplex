import express from 'express'
import applyMiddleware from './middlewares'

const app = express()

applyMiddleware(app)

export default app
