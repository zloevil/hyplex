import * as log4js from 'log4js'
import config from 'config'

const log = log4js.getLogger('schema.announcement-req-type.resolver>')
log.level = config.logger.level

export default parentValue => {
  console.log(parentValue);
  return parentValue.rooms
}
