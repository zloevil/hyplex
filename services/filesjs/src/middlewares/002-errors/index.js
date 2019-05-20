import * as log4js from 'log4js'
import config from 'config'
import Boom from 'boom'

const log = log4js.getLogger('middleware-logger>')
log.level = config.logger.logLevel

module.exports = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    if (err) {
      if (err.isBoom) {
        ctx.status = err.output.statusCode
        ctx.set({
          ...ctx.response.headers,
          ...err.output.headers,
        })
        ctx.body = err.output.payload
      } else {
        ctx.status = err.status || 500
        ctx.body = Boom.boomify(err, { statusCode: err.status, message: err.message })
          .output
          .payload
      }
      ctx.app.emit('error', err, ctx)
      return
    }
    const { output: internalErrorOutput } = Boom.internal('Something went wrong')
    ctx.status = internalErrorOutput.statusCode
    ctx.body = internalErrorOutput.payload
  }
}
