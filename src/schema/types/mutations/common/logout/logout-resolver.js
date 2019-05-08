import * as log4js from 'log4js'
import config from 'config'
import { GraphQLError } from 'graphql'
import Session from '../../../../../db/models/Session'

const log = log4js.getLogger('schema.query.login-type.resolver>')
log.level = config.logger.level

export default async (parentValue, args, { token }) => {
  try {
    const user = await Session.getUserByUserToken(token)
    await Session.deleteSession(token)
    return `> User ${user.login} successfully logout!`
  } catch (e) {
    log.error('> Error, while trying to logout user!\n', e)
    return new GraphQLError('> Internal server error!')
  }
}
