import * as log4js from 'log4js'
import config from 'config'
import amqp from 'amqplib/callback_api'

const log = log4js.getLogger('handlers.rabbit>')
log.level = config.logger.level

class Rabbit {
  constructor() {
    this.channels = {}
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

  makeNewQueue(channelName, onMessage) {
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
      const queueIn = `${channelName}_out`
      const queueOut = `${channelName}_in`
      channel.assertQueue(queueIn, {
        durable: true,
      })
      channel.assertQueue(queueOut, {
        durable: true,
      })
      channel.prefetch(1)

      channel.consume(queueOut, async msg => {
        let content
        const id = msg.properties.correlationId
        try {
          content = JSON.parse(msg.content.toString())
        } catch (e) {
          log.error(`> Error, while trying to parse message from ${queueOut}!\n`, e)
          return
        }
        try {
          await onMessage(id, content)
        } catch (e) {
          log.error(`> Error, while trying to handle message from ${queueOut}!\n`, e)
          return
        }

        // answer
        let message
        try {
          message = JSON.stringify({
            createdAt: (new Date()).toISOString()
          })
        } catch (e) {
          log.error('> Error, while trying to stringify message!\n', e)
        }
        channel.sendToQueue(queueIn, Buffer.from(message), {
          persistent: true,
          correlationId: id,
        })
        // answer

        channel.ack(msg)
      })
      res()
    })
  }
}

const rabbit = new Rabbit()

export default rabbit
