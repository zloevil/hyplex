import * as log4js from 'log4js'
import config from 'config'
import { GraphQLError } from 'graphql'
import Joi from 'joi'
import User from '../../../../db/models/User'
import rabbit from '../../../../handlers/rabbit'
import { services } from '../../../../handlers/rabbit/config'

const log = log4js.getLogger('schema.mutation.newuser-type.resolver>')
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
    const userId = await User.registerNewUser(login, password)
    const eventId = await rabbit.sendMsg(services.mailer, {
      mail: login,
    })
    await User.makeNewUserAccountConfirmationTicket(userId.user_id, eventId.id)
    return login
  } catch (e) {
    log.error('> Error, while trying to create a new user!\n', e)
    return new GraphQLError('User with this email already exist!')
  }
}
