require('@babel/register')
require('babel-polyfill')
require('dotenv').config()
const log4js = require('log4js')
const mailer = require('./src/mailer')
const rabbit = require('./src/handler/rabbit').default
const { services } = require('./src/handler/rabbit/config')

const log = log4js.getLogger('mailer>')
log.level = 'all'

const auth = {
  user: process.env.DIST_MAIL,
  pass: process.env.DIST_MAIL_PASS,
}

const linkTemplate = 'http://localhost:8080/email/verify/'


async function sendMail(mail, message, auth) {
  try {
    const transport = await mailer.transportInit(auth)
    await mailer.sendMail({
      subject: 'Подтверждение регистрации',
      to: mail,
      message,
    }, transport)
  } catch (e) {
    log.error('> Error, while trying to send mail!\n', e)
  }
}

rabbit.makeNewQueue(services.mailer, (id, content) => {
  return new Promise(async (res, rej) => {
    const { mail } = content
    if (!mail) {
      log.error('> Error, while trying to get mail from new msg')
      return rej()
    }
    if (!id) {
      log.error('> Error, while trying to get id from new msg')
      return rej()
    }

    try {
      await sendMail(mail,
        'Для поддтверждения учетной записи пройдите по следующей ссылке' +
        ` ${linkTemplate}${id}`
        , auth)
      res()
    } catch (e) {
      log.error(`> Error, while trying to send message to ${mail}!\n`, e)
      rej(e)
    }
  })
})
