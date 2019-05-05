import * as log4js from 'log4js'
import config from 'config'
import joi from 'joi'
import User from '../../db/models/User'

const log = log4js.getLogger('handler.registration>')
log.level = config.logger.level

const schema = joi.object().keys({
  login: joi.string().email({ minDomainSegments: 2 }).required(),
  password: joi.string().min(4).max(250).required(),
})

export default async (req, res) => {
  const check = joi.validate(req.body, schema)
  if (check.error !== null) {
    res.boom.badRequest('Invalid credentials!')
  }
  try {
    if (await User.checkLogin(req.body.login)) {
      await User.registerNewUser(req.body.login, req.body.password)
      res
        .redirect('/oauth/login')
    }
  } catch (e) {
    log.error('> Error while checking email or registration!\n', e)
    res.boom.badRequest('Account with this email is already exists!', e)
  }
}
