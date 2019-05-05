import * as log4js from 'log4js'
import config from 'config'
import Session from '../../db/models/Session'

const log = log4js.getLogger('handler.login>')
log.level = config.logger.level


export default async (req, res) => {
  try {
    const check = await Session.getSessionByUserToken(req.token)
    if (check.sid) {
      await Session.deleteSession(req.token)
      res
        .status(200)
        .end()
    } else {
      res.boom.badRequest('Session does not exist!')
    }
  } catch (e) {
    log.error('> Error while logout!\n', e)
    res.boom.badRequest('Logout failed!')
  }
}
