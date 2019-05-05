import config from 'config'
import crypto from 'crypto'
import * as log4js from 'log4js'
import util from 'util'
import db from '../index'

const log = log4js.getLogger('model.user>')
log.level = config.logger.level

const scrypt = util.promisify(crypto.scrypt)
const secret = process.env.ROOT_PASSWORD_SECRET

const makeNewToken = async id => {
  let key
  try {
    key = await scrypt(secret, 'salt', 24)
  } catch (e) {
    log.error('> Error, while trying to create a key for cipher!\n', e)
  }

  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-192-cbc', key, iv)

  let encrypted = cipher.update(id, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  return encrypted
}

class Session {
  static async makeNewSession(id) {
    const oldSession = await Session.getSessionByUserId(id)
    if (oldSession.sid) {
      await Session.updateSessionEX(oldSession)
      return oldSession.sid
    }
    const ex = (new Date(Date.now() + config.session.ex))
      .toISOString()
      .replace('T', ' ')
      .replace('Z', '')
    const token = await makeNewToken(id)
    log.debug('token:\t', token)
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
