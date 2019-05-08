import config from 'config'
import * as log4js from 'log4js'
import db from '../index'

const log = log4js.getLogger('model.user>')
log.level = config.logger.level

class Session {
  static async makeNewSession(id, token) {
    const oldSession = await Session.getSessionByUserId(id)
    if (oldSession.sid) {
      await Session.updateSessionEX(oldSession)
      return oldSession.sid
    }
    const ex = (new Date(Date.now() + config.session.ex))
      .toISOString()
      .replace('T', ' ')
      .replace('Z', '')
    await db.query`
        INSERT INTO "public"."session" ("sid", "user_id", "ex")
        VALUES (${token}, ${id}, ${ex})
    `
    return token
  }

  static getSessionByUserId(id) {
    return db.query`
      SELECT sid, ex, user_id
      FROM session
      WHERE user_id = ${id}
    `
  }

  static getSessionByUserToken(token) {
    return db.query`
      SELECT sid, ex, user_id
      FROM session
      WHERE sid = ${token}
    `
  }

  static getUserByUserToken(token) {
    return db.query`
      SELECT u.login, u.user_id
      FROM session
      JOIN "user" u on session.user_id = u.user_id
      WHERE sid = ${token}
    `
  }

  static updateSessionEX(session) {
    const newEX = (new Date(Date.now() + config.session.ex))
      .toISOString()
      .replace('T', ' ')
      .replace('Z', '')
    return db.query`
      UPDATE "public"."session"
      SET "ex" = ${newEX}
      WHERE "user_id" = ${session.user_id}
    `
  }

  static deleteSession(token) {
    return db.query`
      DELETE FROM session
      WHERE sid = ${token}
    `
  }
}

export default Session
