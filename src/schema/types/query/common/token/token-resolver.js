import * as log4js from 'log4js'
import config from 'config'
import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import User from '../../../../../db/models/User'

const log = log4js.getLogger('schema.query.token-type.resolver>')
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
    return new GraphQLError('> Invalid credentials!')
  }
  try {
    const check = await User.checkPassword(login, password)
    if (check) {
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

        return jwt.sign(
          payload,
          process.env.JWT_SECRET,
          {
            expiresIn: 3600 * 24 * 7,
          },
        )
      }
    }
  } catch (e) {
    return new GraphQLError('> Internal server error!')
  }
  return new GraphQLError('> Invalid password or login!')
}
