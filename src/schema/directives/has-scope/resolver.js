import { GraphQLError } from 'graphql'
import * as log4js from 'log4js'
import config from 'config'

const log = log4js.getLogger('schema.directive.is-authenticated>')
log.level = config.logger.level


export default (resolve, source, args, { req }) => {
  const { scopes } = req.ctx
  let expectedScopes = args.scope
  if (!Array.isArray(expectedScopes)) {
    expectedScopes = [expectedScopes]
  }
  if (!scopes) {
    return new GraphQLError('You must supply a JWT for authorization!')
  }
  if (expectedScopes.some(scope => scopes.indexOf(scope) !== -1)) {
    return resolve()
  }
  return Promise.reject(
    new Error(`You are not authorized. Expected scopes: ${expectedScopes.join(', ')}`),
  )
}
