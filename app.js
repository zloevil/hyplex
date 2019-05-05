import http from 'http'
import config from 'config'
import * as log4js from 'log4js'
import app from './src/server'
import pool from './src/db'

const port = config.server.port || 8080
const server = http.createServer(app)
const log = log4js.getLogger('app>')
log.level = config.logger.level

server.listen(port, () => {
  log.info(`Server listen on port: ${port}`)
})

server.pool = pool

module.exports = server
