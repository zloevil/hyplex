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
       ;hashKey=${userId}${'reset'}
    `
  }

  static getUsersAnnouncements(id) {
    return db.query`
      SELECT id, rooms, timestamp, shapes
      FROM owners
      JOIN announcements ON anno_id=id
      WHERE user_id=${id}
    ;hashKey=${id}
    `
  }

  static isUserAnnouncement(userId, annoId) {
    return db.query`
      SELECT user_id, anno_id
      FROM owners
      WHERE user_id=${userId} AND anno_id=${annoId}
    `
  }

  static async editUserAnnouncement(annoId, userId, rooms, shapes) {
    let data
    try {
      data = JSON.stringify(rooms)
    } catch (e) {
      log.error('> Error, while trying to stringify data for a announcement!')
      throw e
    }
    const check = await Announcement.isUserAnnouncement(userId, annoId)
    if (check.user_id !== userId) return []

    return db.query`
      UPDATE "public"."announcements"
      SET "rooms" = ${data}, "shapes" = ${shapes} WHERE "id" = ${annoId}
      RETURNING id
    `
  }
}

export default Announcement
