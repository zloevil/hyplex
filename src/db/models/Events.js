import config from 'config'
import * as log4js from 'log4js'
import db from '../index'

const log = log4js.getLogger('model.user>')
log.level = config.logger.level

class Events {
  static makeNewEvent(service, rawData) {
    let data
    try {
      data = JSON.stringify(rawData)
    } catch (e) {
      log.error('> Error, while trying to stringify events data!')
      throw e
    }
    return db.query`
        INSERT INTO "public"."events" ("service", "id", "data")
        VALUES (${service}, DEFAULT, ${data})
        RETURNING id;
    `
  }

  static deleteEvent(id) {
    return db.query`
        DELETE FROM "public"."events"
        WHERE "id"=${id}
    `
  }
}

export default Events
