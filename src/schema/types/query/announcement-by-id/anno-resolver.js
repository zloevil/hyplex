import * as log4js from 'log4js'
import config from 'config'
import { GraphQLError } from 'graphql'
import Announcement from '../../../../db/models/Announcement'

const log = log4js.getLogger('schema.announcement-by-id-req-type.resolver>')
log.level = config.logger.level

export default (parentValue, { id }, { req }) => Announcement.getAnnouncementById(id, req.ctx.id)
  .catch(err => new GraphQLError(err))
