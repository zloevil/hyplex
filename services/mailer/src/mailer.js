import * as nodemailer from 'nodemailer'
import path from 'path'
import log4js from 'log4js'
import { htmlToText } from 'nodemailer-html-to-text'
import SMTPTransport from 'nodemailer-smtp-transport'
import pug from 'pug'
import juice from 'juice'
import config from 'config'

const log = log4js.getLogger('mailer>')
log.level = 'all'

export async function transportInit(auth) {
  // init
  const mailerOptions = config.SMTPTransport
  mailerOptions.auth = auth
  const transportEngine = new SMTPTransport(mailerOptions)
  const transport = nodemailer.createTransport(transportEngine)

  // middleware
  transport.use('compile', htmlToText())

  // check
  transport.verify(error => {
    if (error) {
      log.error(error)
      process.exit(1)
    } else {
      // log.info('Server is ready to take our messages')
    }
  })

  return transport
}


export async function sendMail(options, transport) {
  const message = {}

  const sender = config.senders[options.from || 'default']
  if (!sender) {
    throw new Error(`Unknown sender:${options.from}`)
  }

  message.from = {
    name: sender.fromName,
    address: sender.fromEmail,
  }

  // for template
  const locals = Object.create(options)

  locals.config = config
  locals.sender = sender


  message.html = pug.renderFile(`${path.join(__dirname, '/template')}/index.pug`, locals)
  message.html = juice(message.html)


  message.to = (typeof options.to === 'string') ? { address: options.to } : options.to

  if (process.env.MAILER_REDIRECT) { // for debugging
    message.to = { address: sender.fromEmail }
  }

  if (!message.to.address) {
    throw new Error(`No email for recipient, message options:${JSON.stringify(options)}`)
  }

  message.subject = options.subject

  message.headers = options.headers

  try {
    await transport.sendMail(message)
  } catch (e) {
    log.error('> Error, while trying to send a root password message!\n', e)
  }
}
