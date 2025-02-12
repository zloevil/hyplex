import * as log4js from 'log4js'
import config from 'config'
import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import User from '../../../../../db/models/User'
import Session from '../../../../../db/models/Session'

const log = log4js.getLogger('schema.query.login-type.resolver>')
log.level = config.logger.level

const schema = Joi.object().keys({
  password: Joi.string().min(4).required(),
  login: Joi.string().email({ minDomainSegments: 2 }).required(),
})

export default async (parentValue, { login, password }) => {
  const schemaCheck = Joi.validate({
    login,
    password,
  }, schema)
  if (schemaCheck.error) {
    log.error('> Error: invalid credentials!')
    return new GraphQLError('> Invalid credentials!')
  }
  try {
    const check = await User.checkPassword(login, password)
    if (check) {
      const user = await User.getUserByLogin(login)
      if (user && user.confirmed) {
        const payload = {
          user: {
            id: user.user_id,
            email: user.login,
          },
          scopes: [
            'read',
            'write',
          ],
        }
        const token = jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {
            expiresIn: config.session.ex,
          },
        )
        await Session.makeNewSession(user.user_id, token)
        return token
      }
    }
  } catch (e) {
    log.error('> Error, while trying to check user password, or get user by login!\n', e)
    return new GraphQLError('> Internal server error!')
  }
  log.error('> Error: invalid credentials!')
  return new GraphQLError('> Invalid credentials or account is not confirmed!')
}
