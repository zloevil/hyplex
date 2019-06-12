import * as log4js from 'log4js'
import config from 'config'
import { GraphQLError } from 'graphql'
import jwt from 'jsonwebtoken'
import Joi from 'joi'
import User from '../../../../../db/models/User'
import Session from '../../../../../db/models/Session'
import authenticateGoogle from '../../../../../handlers/passport/google-oauth'

const log = log4js.getLogger('schema.query.login-type.resolver>')
log.level = config.logger.level

const schema = Joi.object().keys({
  accessToken: Joi.string().required(),
})

export default async (_, { accessToken }, { req, res }) => {
  const schemaCheck = Joi.validate({
    accessToken,
  }, schema)
  if (schemaCheck.error) {
    log.error('> Error: invalid credentials!')
    return new GraphQLError('> Invalid credentials!')
  }

  req.body = {
    ...req.body,
    access_token: accessToken,
  }

  try {
    // data contains the accessToken, refreshToken and profile from passport
    const { data, info } = await authenticateGoogle(req, res)

    if (data) {
      const user = await User.loginViaGoogle(data)

      if (!Array.isArray(user)) {
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

    if (info) {
      switch (info.code) {
        case 'ETIMEDOUT':
          return (new GraphQLError('Failed to reach Google: Try Again!'))
        default:
          return (new GraphQLError('Something went wrong!'))
      }
    }
    return (GraphQLError('Internal server error!'))
  } catch (error) {
    return GraphQLError(JSON.stringify(error))
  }
}
