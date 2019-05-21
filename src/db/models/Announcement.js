import config from 'config'
import * as log4js from 'log4js'
import db from '../index'

const log = log4js.getLogger('model.announcement>')
log.level = config.logger.level

class Announcement {
  static makeNewAnnouncement(userId, rooms, shapes) {
    let data
    try {
      data = JSON.stringify(rooms)
    } catch (e) {
      log.error('> Error, while trying to stringify data for a announcement!')
      throw e
    }
    return db.query`
       SELECT make_new_announcement(${userId}, ${data}, ${shapes}) AS id;
    `
  }

  static getUsersAnnouncements(id) {
    return db.query`
      SELECT id, rooms, timestamp, shapes
      FROM owners
      JOIN announcements ON anno_id=id
      WHERE user_id=${id};
    `
  }
}

export default Announcement
