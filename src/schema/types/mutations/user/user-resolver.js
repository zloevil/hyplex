import * as log4js from 'log4js'
import config from 'config'
import { GraphQLError } from 'graphql'
import Joi from 'joi'
import jwt from 'jsonwebtoken'
import User from '../../../../db/models/User'
import Session from '../../../../db/models/Session'

const log = log4js.getLogger('schema.mutation.newuser-type.resolver>')
log.level = config.logger.level

const schema = Joi.object().keys({
  password: Joi.string().required(),
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
    await User.registerNewUser(login, password)
    const user = await User.getUserByLogin(login)
    if (user) {
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
          expiresIn: 3600 * 24 * 7,
        },
      )
      await Session.makeNewSession(user.user_id, token)
      return token
    }
  } catch (e) {
    log.error('> Error, while trying to create a new user!\n', e)
    return new GraphQLError('> Internal server error!')
  }
  return new GraphQLError('> Internal server error!')
}
