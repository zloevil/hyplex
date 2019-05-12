import db from '../index'

class Email {
  static addEmail(email) {
    return db.query`
      INSERT INTO "public"."email" ("email") 
      VALUES (${email})
    `
  }

  static deleteEmail(emails) {
    const querys = emails.map(email => db.query`
    DELETE FROM "public"."email"
    WHERE "email" LIKE ${email}
    ESCAPE '#'
  `)
    return Promise.all(querys)
  }

  static editEmail(oldEmail, newEmail) {
    return db.query`
      UPDATE "public"."email"
      SET "email" = ${newEmail}
      WHERE "email" LIKE ${oldEmail}
      ESCAPE '#'
    `
  }

  static getEmailsList() {
    return db.query`
      SELECT t.* FROM public.email t
    `
  }
}

export default Email
