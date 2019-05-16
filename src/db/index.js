/* eslint-disable no-param-reassign,prefer-destructuring */
import { Pool } from 'pg'
import * as log4js from 'log4js'
import config from 'config'
import redis from 'redis'
import util from 'util'
import _ from 'lodash'

const log = log4js.getLogger('db>')
log.level = config.logger.level

let pool = new Pool()
const redisClient = redis.createClient(config.redis.URL)
redisClient.hget = util.promisify(redisClient.hget)

function reqPreparer(reqStrings, ...reqParams) {
  let resultQueryString = reqStrings[0]
  for (let i = 1; i < reqStrings.length; i += 1) {
    resultQueryString += `$${i}${reqStrings[i]}`
  }

  return {
    text: resultQueryString,
    values: reqParams,
  }
}

function getHashKey(preparedReq) {
  const isHashKeyExists = _.split(preparedReq.text, ';hashKey=')
  let hashKey = null
  if (isHashKeyExists.length > 1) {
    hashKey = preparedReq.values[preparedReq.values.length - 1]
    preparedReq.text = isHashKeyExists[0]
    preparedReq.values = _.dropRight(preparedReq.values, 1)
  }
  // eslint-disable-next-line no-sequences
  return [preparedReq, hashKey, preparedReq.text.indexOf('SELECT')]
}

async function query(reqStrings, ...reqParams) {
  if (pool === null) {
    pool = new Pool()
  }

  let preparedReq
  let key

  if (Array.isArray(reqStrings)) {
    preparedReq = reqPreparer(reqStrings, ...reqParams)
  } else {
    preparedReq = reqStrings
  }

  const temp = getHashKey(preparedReq)
  preparedReq = temp[0]
  const hashKey = temp[1]
  if (hashKey && temp[2] !== -1) {
    try {
      key = JSON.stringify(preparedReq)
      const cacheValue = await redisClient.hget(hashKey, key)
      if (cacheValue) {
        log.debug('SERVED BY CACHE')
        return JSON.parse(cacheValue)
      }
    } catch (e) {
      log.error('> Error, while trying to cache db request!\n', e)
    }
  } else if (hashKey) {
    redisClient.del(hashKey)
  }

  let result = null
  const client = await pool.connect()

  try {
    await client.query('BEGIN')
    result = await client.query(preparedReq)
    await client.query('COMMIT')
  } catch (e) {
    await client.query('ROLLBACK')
    log.error('> Error while making a query to DB\n', e)
  }
  client.release()
  log.debug('SERVER BY DB')

  if (hashKey && temp[2] !== -1) {
    if (result.rows && result.rows.length === 1) {
      redisClient.hset(hashKey, key, JSON.stringify(result.rows[0]), 'EX', config.redis.EX)
      return result.rows[0]
    }
    redisClient.hset(hashKey, key, JSON.stringify(result.rows), 'EX', config.redis.EX)
    return result.rows
  }

  if (result.rows && result.rows.length === 1) {
    return result.rows[0]
  }
  return result.rows
}

export default {
  query,
  makeQuery: reqPreparer,
  pool,
}
