import mongoose from 'mongoose'
import config from 'config'
import * as log4js from 'log4js'


const log = log4js.getLogger('db>')
log.level = config.logger.logLevel

mongoose.connect(`${config.mongodb.host}/${config.mongodb.dbName}`, { useNewUrlParser: true })

const db = mongoose.connection
db.on('error', log.error.bind(console, 'connection error:'))
db.once('open', () => {
  log.info('MongoDB, connected')
})

db.on('disconnected', () => {
  // TODO: handle disconnection
  log.warn('MongoDB, disconnected')
})

require('./models')

export default db
