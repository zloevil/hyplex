import * as log4js from 'log4js'
import config from 'config'
import User from '../../../../db/models/User'

const log = log4js.getLogger('schema.user-type.resolver>')
log.level = config.logger.level

export default async (parentValue, { login }) => {
  const user = await User.getUserByLogin(login)
  return user
}
