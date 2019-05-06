import path from 'path'
import helmet from 'helmet'
import cors from 'cors'
import logger from 'morgan'
import config from 'config'
import bodyParser from 'body-parser'
import glob from 'glob'
import lusca from 'lusca'
import * as log4js from 'log4js'
import expressBoom from 'express-boom'
import tokenParser from '../handlers/common/tokenParser'

const log = log4js.getLogger('middlewares>')
log.level = config.logger.level

const applyMiddleware = (app, ...middleware) => {
  middleware.forEach(m => app.use(m))
}

export default app => {
  const middleware = glob
    .sync(path.join(__dirname, '/*.js'))
    .filter(m => m.indexOf('index.js') === -1)
    .map(m => m.replace(path.extname(m), ''))

  log.info(middleware.map(m => `middleware injected ${path.basename(m)}`))
  if (process.env.NODE_ENV !== 'test') {
    applyMiddleware(
      app,
      expressBoom(),
      lusca(config.lusca),
      helmet(),
      cors(),
      logger(config.restLogLevel),
      bodyParser.json(),
      bodyParser.urlencoded({ extended: false }),
      tokenParser,
      /* eslint-disable-next-line */
      ...middleware.map(m => require(m).default),
    )
  } else {
    applyMiddleware(
      app,
      expressBoom(),
      lusca(config.lusca),
      helmet(),
      cors(),
      logger(config.restLogLevel),
      bodyParser.json(),
      bodyParser.urlencoded({ extended: false }),
      tokenParser,
      /* eslint-disable-next-line */
      ...middleware.map(m => require(m).default),
    )
  }
}
