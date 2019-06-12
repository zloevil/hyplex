import db from '../index'

class Server {
  static addServer(name, ip) {
    return db.query`
      INSERT INTO "public"."server" ("name", "ip")
      VALUES (${name}, ${ip})
    `
  }

  static deleteServer(serverIPs) {
    const querys = serverIPs.map(ip => db.query`
    DELETE FROM "public"."server"
    WHERE "ip" LIKE ${ip}
    ESCAPE '#'
  `)
    return Promise.all(querys)
  }

  static editServer({ old, upd }) {
    if (old.name !== null) {
      return db.query`
        UPDATE "public"."server"
        SET "name" = ${upd.name}, "ip" = ${upd.ip}
        WHERE "name" LIKE ${old.name}
        ESCAPE '#'
      `
    }
    return db.query`
        UPDATE "public"."server"
        SET "name" = ${upd.name}, "ip" = ${upd.ip}
        WHERE "ip" LIKE ${old.ip}
        ESCAPE '#'
      `
  }

  static getServersList() {
    return db.query`
      SELECT t.* FROM public.server t
    `
  }
}

export default Server
