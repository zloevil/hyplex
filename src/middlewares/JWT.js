import * as log4js from 'log4js'
import jwt from 'jsonwebtoken'
import config from 'config'
import Session from '../db/models/Session'

const log = log4js.getLogger('middleware.jwt>')
log.level = config.logger.level

export default async (req, res, next) => {
  const { token } = req
  let session
  let payload
  if (token) {
    try {
      payload = jwt.verify(
        token,
        process.env.JWT_SECRET,
      )
    } catch (e) {
      log.error('> Error, while trying to verify token!')
      return res.boom.unauthorized('Error, while trying to verify token!')
    }

    try {
      session = await Session.getSessionByUserToken(token)
    } catch (e) {
      log.error('> Error, while trying to get session from DB!\n', e)
      return res.boom.badImplementation('Internal server error!')
    }
    if (!Array.isArray(session)) {
      const checkExpTime = new Date(session.ex)
      const expTime = new Date(payload.exp * 1000)
      const currDate = new Date()
      if (currDate < checkExpTime && currDate < expTime) {
        req.ctx = {
          id: payload.user.id,
          scopes: payload.scopes,
        }
      }
    }
  }
  next()
}
