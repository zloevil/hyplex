/* eslint-disable import/no-dynamic-require,global-require */
import * as log4js from 'log4js'
import config from 'config'
import Koa from 'koa'
import path from 'path'
import fs from 'fs'
import db from './src/db'
import routing from './src/routes'

const log = log4js.getLogger('app>')
// noinspection JSUnresolvedVariable
log.level = config.logger.logLevel


const app = new Koa()
app.keys = [config.secret]
app.context.db = db
// middlewares
// eslint-disable-next-line security/detect-non-literal-fs-filename
const middlewares = fs.readdirSync(path.join(__dirname, 'src/middlewares')).sort()

middlewares.forEach(middleware => {
  // eslint-disable-next-line security/detect-non-literal-require
  app.use(require(`./src/middlewares/${middleware}`))
})
// routes
app.use(routing.routes())
app.use(routing.allowedMethods())

app.listen(config.server.port)
log.info(`Server run on port ${config.server.port}`)
