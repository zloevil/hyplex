import * as log4js from 'log4js'
import config from 'config'
import { GraphQLError } from 'graphql'
import Announcement from '../../../../db/models/Announcement'

const log = log4js.getLogger('schema.announcement-req-type.resolver>')
log.level = config.logger.level

export default async (parentValue, { id }) => {
  const result = await Announcement.getUsersAnnouncements(id)
  return result
  // .then(res => {
  //   console.log(res);
  //   if (!Array.isArray(res)) {
  //     return [res]
  //   }
  //   return new Promise(resolve => resolve(res))
  // })
  // .catch(err => new GraphQLError(err))
}
