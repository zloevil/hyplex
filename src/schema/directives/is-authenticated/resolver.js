import { GraphQLError } from 'graphql'
import * as log4js from 'log4js'
import config from 'config'

const log = log4js.getLogger('schema.directive.is-authenticated>')
log.level = config.logger.level


export default (resolve, source, args, { req }) => {
  const { ctx } = req
  if (!ctx) {
    log.error('> You must supply a token for authorization!')
    return new GraphQLError('You must supply a token for authorization!')
  }
  return resolve
}
