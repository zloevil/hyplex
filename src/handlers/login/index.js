import * as log4js from 'log4js'
import config from 'config'
import joi from 'joi'
import User from '../../db/models/User'
import Session from '../../db/models/Session'

const log = log4js.getLogger('handler.login>')
log.level = config.logger.level

const schema = joi.object().keys({
  login: joi.string().email({ minDomainSegments: 2 }).required(),
  password: joi.string().min(4).max(250).required(),
})

export default async (req, res) => {
  const check = joi.validate(req.body, schema)
  if (check.error !== null) {
    res.boom.badRequest('Invalid credentials!')
  } else {
    try {
      const result = await User.checkPassword(req.body.login, req.body.password)
      if (result) {
        const user = await User.getUserByLogin(req.body.login)
        const token = await Session.makeNewSession(user.user_id)
        res
          .json({ token })
      } else {
        res.boom.unauthorized('Login failed!')
      }
    } catch (e) {
      log.error('> Error while login!\n', e)
      res.boom.unauthorized('Login failed!')
    }
  }
}
