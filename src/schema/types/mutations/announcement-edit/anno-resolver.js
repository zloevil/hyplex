import * as log4js from 'log4js'
import config from 'config'
import { GraphQLError } from 'graphql'
import Joi from 'joi'
import Announcement from '../../../../db/models/Announcement'

const log = log4js.getLogger('schema.query.announcement-edit.resolver>')
log.level = config.logger.level

const schema = Joi.object().keys({
  id: Joi.string(),
  shapes: Joi.string().required(),
  rooms: Joi.array().items(Joi.object().keys({
    id: Joi.string(),
    date: Joi.number(),
    center: Joi.object().keys({ x: Joi.number(), y: Joi.number() }),
    tags: Joi.array().items(Joi.string().alphanum()).required(),
    equipment: Joi.array().items(Joi.string().alphanum()).required(),
    walls: Joi.array().items(Joi.string()).required(),
    photos: Joi.array().items(Joi.string()),
  })),
})

export default (parentValue, { id, shapes, rooms }, { req }) => {
  const schemaCheck = Joi.validate({
    id,
    shapes,
    rooms,
  }, schema)
  if (schemaCheck.error) {
    log.error('> Error: invalid credentials!\n', schemaCheck.error)
    return new GraphQLError('> Invalid credentials!')
  }
  const userId = req.ctx.id
  return Announcement.editUserAnnouncement(id, userId, rooms, shapes)
}
