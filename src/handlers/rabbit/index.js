import * as log4js from 'log4js'
import config from 'config'
import amqp from 'amqplib/callback_api'
import Events from '../../db/models/Events'

const log = log4js.getLogger('handlers.rabbit>')
log.level = config.logger.level

class Rabbit {
  constructor() {
    this.channels = {}
    this.queues = {}
  }

  connect(connectionURL = process.env.RABBITMQ_URL) {
    return new Promise((res, rej) => {
      amqp.connect(connectionURL, (err0, connection) => {
        if (err0) {
          return rej(err0)
        }
        this._connection = connection
        return res(connection)
      })
    })
  }

  _makeNewChannel(channelName) {
    // eslint-disable-next-line consistent-return
    return new Promise(async (res, rej) => {
      let { _connection } = this
      if (_connection === undefined) {
        try {
          _connection = await this.connect()
        } catch (e) {
          log.error('> Error, while trying to create a connection with rabbit mq!\n', e)
          return rej(e)
        }
      }

      _connection.createChannel((err1, channel) => {
        if (err1) {
          return rej(err1)
        }

        // eslint-disable-next-line security/detect-object-injection
        this.channels[channelName] = channel
        return res(channel)
      })
    })
  }

  makeNewQueue(channelName) {
    return new Promise(async (res, rej) => {
      let channel = this.channels[channelName]
      if (!channel) {
        try {
          channel = await this._makeNewChannel(channelName)
        } catch (e) {
          log.error('> Error, while trying to make a new channel!\n', e)
          rej(e)
        }
      }
      const queueIn = `${channelName}_in`
      const queueOut = `${channelName}_out`
      channel.assertQueue(queueIn, {
        durable: true,
      })
      channel.assertQueue(queueOut, {
        durable: true,
      })
      channel.prefetch(1)

      channel.consume(queueOut, msg => {
        const id = msg.properties.correlationId
        // log.debug(id)
        Events.deleteEvent(id)
          .then(() => {
            channel.ack(msg)
          })
          .catch(reject => log.error('> Error, while trying to delete event from DB!\n', reject))
      })

      const send = async message => {
        let msg
        try {
          msg = JSON.stringify(message)
        } catch (e) {
          log.error('> Error, while trying to stringify message!\n', e)
        }
        const id = await Events.makeNewEvent(channelName, msg)
        channel.sendToQueue(queueIn, Buffer.from(msg), {
          persistent: true,
          correlationId: id.id,
        })
        return id
      }
      res(send)
      this.queues[channelName] = send
    })
  }

  sendMsg(queueName, msg) {
    return new Promise(async (res, rej) => {
      let queue = this.queues[queueName]
      if (!queue) {
        try {
          queue = await this.makeNewQueue(queueName)
        } catch (e) {
          log.error('> Error, while trying to make a new channel!\n', e)
          rej(e)
        }
      }
      res(await queue(msg))
    })
  }
}

const rabbit = new Rabbit()

export default rabbit
