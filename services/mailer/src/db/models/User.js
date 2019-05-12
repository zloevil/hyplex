import config from 'config'
import crypto from 'crypto'
import db from '../index'

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

  static async checkLogin(email) {
    const result = await db.query`
      SELECT "login"
      FROM "user"
      WHERE "login" = ${email}
    `
    return result == null || result.email !== email
  }

  static async registerNewUser(email, password) {
    const resPass = this.generateNewHashForPassword(password)
    await db.query`
      INSERT INTO "user" ("user_id", "login", "salt", "digest")
      VALUES (DEFAULT, ${email}, ${resPass.salt}, ${resPass.hashPassword})
    `
  }

  static async getUserByLogin(login) {
    // noinspection UnnecessaryLocalVariableJS
    const result = await db.query`
      SELECT "login", "user_id"
      FROM "user"
      WHERE "login" = ${login}
    `
    return result
  }

  static async getUserDistributionMail(login) {
    // noinspection UnnecessaryLocalVariableJS
    const result = await db.query`
      SELECT "distributionmail", "distributionmailpass", "distributionmailpassiv"
      FROM "user"
      WHERE "login" = ${login}
    `
    return result
  }

  static async getUserById(id) {
    // noinspection UnnecessaryLocalVariableJS
    const result = await db.query`
      SELECT "login", "user_id"
      FROM "user"
      WHERE "user_id" = ${id}
    `
    return result
  }
}

export default User
