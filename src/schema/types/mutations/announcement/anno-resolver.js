import * as log4js from 'log4js'
import config from 'config'
import { GraphQLError } from 'graphql'
import Joi from 'joi'
import Announcement from '../../../../db/models/Announcement'

const log = log4js.getLogger('schema.query.login-type.resolver>')
log.level = config.logger.level

const schema = Joi.object().keys({
  shapes: Joi.string().required(),
  rooms: Joi.object().keys({
    tags: Joi.array().items(Joi.string().alphanum()).required(),
    equipment: Joi.array().items(Joi.string().alphanum()).required(),
    walls: Joi.array().items(Joi.string().alphanum()).required(),
  }),
})

export default (parentValue, { shapes, rooms }, { req }) => {
  const schemaCheck = Joi.validate({
    shapes,
    rooms,
  }, schema)
  if (schemaCheck.error) {
    log.error('> Error: invalid credentials!\n', schemaCheck.error)
    return new GraphQLError('> Invalid credentials!')
  }
  const { id } = req.ctx
  return Announcement.makeNewAnnouncement(id, rooms, shapes)
}
