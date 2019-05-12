require('@babel/register')
require('babel-polyfill')
require('dotenv').config()
const util = require('util')
const log4js = require('log4js')
const crypto = require('crypto')
const mailer = require('./src/mailer')
const User = require('./src/db/models/User').default
const Server = require('./src/db/models/Server').default
const Email = require('./src/db/models/Email').default
const rabbit = require('./src/handler/rabbit').default
const { services } = require('./src/handler/rabbit/config')

const log = log4js.getLogger('mailer>')
log.level = 'all'

// const scrypt = util.promisify(crypto.scrypt)
// const secret = process.env.ROOT_PASSWORD_SECRET
//
// async function makeTextMsg(serversList) {
//   let key
//   let result = serversList
//   try {
//     key = await scrypt(secret, 'salt', 24)
//   } catch (e) {
//     log.error('> Error, while trying to create a key for cipher!\n', e)
//   }
//   if (!Array.isArray(result)) {
//     result = [result]
//   }
//   return result.reduce((acc, {
//     name, ip, rootpassword, iv,
//   }) => {
//     const decipher = crypto.createDecipheriv('aes-192-cbc', key, Buffer.from(iv, 'base64'))
//
//     decipher.update(rootpassword, 'hex')
//     const decrypted = decipher.final()
//     acc.push(`${name}@${ip}::"${decrypted.toString()}"`)
//     // return `${acc}${name}@${ip}::"${decrypted.toString()}"`
//     return acc
//   }, [])
// }
//
// async function passwordDecipher(password, iv) {
//   let key
//   try {
//     key = await scrypt(secret, 'salt', 24)
//   } catch (e) {
//     log.error('> Error, while trying to create a key for cipher!\n', e)
//   }
//   const bufferIV = Buffer.from(iv, 'base64')
//   const decipher = crypto.createDecipheriv('aes-192-cbc', key, bufferIV)
//
//   let decrypted = decipher.update(password, 'hex', 'utf-8')
//   decrypted += decipher.final('utf-8')
//   return decrypted
// }
//
// async function sendMail(mail, message, auth) {
//   try {
//     const transport = await mailer.transportInit(auth)
//     await mailer.sendMail({
//       subject: 'Подтверждение регистрации',
//       to: mail,
//       message,
//     }, transport)
//   } catch (e) {
//     log.error('> Error, while trying to send mail!\n', e)
//   }
// }
//
// async function makeNewsletter() {
//   const auth = {
//     user: null,
//     pass: null,
//   }
//   let emailsList
//   let msg
//   try {
//     msg = await makeTextMsg(await Server.getServersList())
//     emailsList = await Email.getEmailsList()
//     const distributionMail = await User.getUserDistributionMail('admin')
//     const { distributionmailpass, distributionmailpassiv, distributionmail } = distributionMail
//     const password = await passwordDecipher(distributionmailpass, distributionmailpassiv)
//     auth.user = distributionmail
//     auth.pass = password
//   } catch (e) {
//     log.error('> Error, while trying to get dist mail credentials!\n', e)
//   }
//
//   for (let i = 0; i < emailsList.length; i += 1) {
//     const mail = emailsList[i].email
//     try {
//       // eslint-disable-next-line no-await-in-loop
//       await sendMail(mail, msg, auth)
//     } catch (e) {
//       log.error(`> Error, while trying to send mail on:\t${mail}!\n`, e)
//     }
//   }
// }

rabbit.makeNewQueue(services.mailer, async (id, content) => {
  console.log('id:\t', id)
  console.log(content)
})
