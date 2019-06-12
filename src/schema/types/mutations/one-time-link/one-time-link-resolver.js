import * as log4js from 'log4js'
import config from 'config'
import { GraphQLError } from 'graphql'
import Joi from 'joi'
import axios from 'axios'
import { MongooseObjectIdJoi } from './custom-jois'

const log = log4js.getLogger('schema.mutation.one-time-link-type.resolver>')
log.level = config.logger.level

const schema = Joi.object().keys({
  type: Joi.string().valid('download', 'upload', 'delete', 'move').required(),
  name: Joi.string().regex(/[a-zA-Z0-9\-_.]*/),
  isZipped: Joi.boolean(),
  directory: Joi.string().regex(/[a-zA-Z0-9\-_]*/),
  id: MongooseObjectIdJoi.string().isMongoObjectId(),
  lifeTime: Joi.number().integer(),
})

export default (parentValue, args) => {
  const schemaCheck = Joi.validate(args, schema)
  if (schemaCheck.error) {
    log.error('> Error: invalid credentials!')
    return new GraphQLError('> Invalid credentials!')
  }
  return axios.post(`${config['files-js'].url}/api/file/generate-one-time-link/`, args)
    .then(res => `/public/file/${res.data.hash}`)
    .catch(err => new GraphQLError(err))
}
