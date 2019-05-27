import config from 'config'
import crypto from 'crypto'
import * as log4js from 'log4js'
import db from '../index'

const log = log4js.getLogger('model.user>')
log.level = config.logger.level

class User {
  static generateNewHashForPassword(password) {
    if (password !== undefined) {
      if (password.length < 4) {
        throw new Error('The password must contain more than 4 characters')
      }
    }
    const salt = crypto.randomBytes(config.crypto.hash.length).toString('base64')

    if (password) {
      const hashPassword = crypto.pbkdf2Sync(
        password,
        salt,
        12000,
        config.crypto.hash.length,
        'sha256',
      ).toString('base64')
      return {
        salt,
        hashPassword,
      }
    }
    return null
  }

  static async checkPassword(login, password) {
    const result = await db.query`
      SELECT "digest", "salt"
      FROM "user"
      WHERE "login" = ${login}
    `
    if (!password) return false
    if (!result || !result.digest) return false
    return crypto.pbkdf2Sync(
      password,
      result.salt,
      12000,
      config.crypto.hash.length,
      'sha256',
    ).toString('base64') === result.digest
  }

  static async checkPasswordById(id, password) {
    const result = await db.query`
      SELECT "digest", "salt"
      FROM "user"
      WHERE "user_id" = ${id}
    `
    if (!password) return false
    if (!result || !result.digest) return false
    return crypto.pbkdf2Sync(
      password,
      result.salt,
      12000,
      config.crypto.hash.length,
      'sha256',
    ).toString('base64') === result.digest
  }

  static async checkLogin(email) {
    const result = await db.query`
      SELECT "login"
      FROM "user"
      WHERE "login" = ${email}
    `
    return result == null || result.email !== email
  }

  static async registerNewUser(email, password) {
    if (password) {
      const { salt, hashPassword } = this.generateNewHashForPassword(password)
      return db.query`
        INSERT INTO "public"."user" ("user_id", "login", "salt", "digest") 
        VALUES (DEFAULT, ${email}, ${salt}, ${hashPassword})
        RETURNING "user_id";
      `
    }
    return db.query`
      INSERT INTO "public"."user" ("user_id", "login", "salt", "digest") 
      VALUES (DEFAULT, ${email}, '', '')
      RETURNING "user_id";
    `
  }

  static async updateUserPassword(id, password) {
    const resPass = this.generateNewHashForPassword(password)
    await db.query`
      UPDATE "public"."user"
      SET "salt" = ${resPass.salt}, "digest" = ${resPass.hashPassword}
      WHERE "user_id" = ${id}
    `
  }

  static async getUserByLogin(login) {
    const result = await db.query`
      SELECT "login", "user_id", "confirmed"
      FROM "user"
      WHERE "login" = ${login}
    `
    return result
  }

  static async getUserInfoByLogin(login) {
    const result = await db.query`
      SELECT "login", "user_id"
      FROM "user"
      WHERE "login" = ${login}
    `
    return result
  }

  static async getUserInfoById(id) {
    const result = await db.query`
      SELECT "login", "user_id"
      FROM "user"
      WHERE "user_id" = ${id}
    `
    return result
  }

  static confirmAccount(id) {
    return db.query`
      UPDATE "public"."user"
      SET "confirmed" = true
      WHERE "user_id" = ${id}
    `
  }


  static async getUserById(id) {
    const result = await db.query`
      SELECT "login", "user_id"
      FROM "user"
      WHERE "user_id" = ${id}
    `
    return result
  }

  static makeNewUserAccountConfirmationTicket(userId, eventId) {
    return db.query`
      INSERT INTO "public"."account_confirmation" ("user_id", "event_id", "timestamp")
      VALUES (${userId}, ${eventId}, DEFAULT)
    `
  }

  static getUserIdByEventId(eventId) {
    return db.query`
      DELETE FROM public.account_confirmation
      WHERE event_id=${eventId}
      RETURNING user_id;
    `
  }

  static async loginViaGoogle({ accessToken, refreshToken, profile }) {
    const email = profile.emails[0].value
    let user

    try {
      user = await this.getUserByLogin(email)
    } catch (e) {
      log.error('> Error, while trying to get user by email!\n', e)
      return null
    }

    if (Array.isArray(user)) {
      try {
        user = await this.registerNewUser(email)
      } catch (e) {
        log.error('> Error, while trying to make a new user!\n', e)
        return null
      }
    }

    return user
  }
}

export default User
