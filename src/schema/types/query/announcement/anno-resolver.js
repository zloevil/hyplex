import * as log4js from 'log4js'
import config from 'config'
import { GraphQLError } from 'graphql'
import Announcement from '../../../../db/models/Announcement'

const log = log4js.getLogger('schema.announcement-req-type.resolver>')
log.level = config.logger.level

export default (parentValue, { id }) => Announcement.getUsersAnnouncements(id)
  .then(res => {
    if (!Array.isArray(res)) {
      return [res]
    }
    return res
  })
  .catch(err => new GraphQLError(err))
