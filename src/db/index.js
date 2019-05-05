import { Pool } from 'pg'
import * as log4js from 'log4js'
import config from 'config'

const log = log4js.getLogger('db>')
log.level = config.logger.level

let pool = new Pool()

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

async function query(reqStrings, ...reqParams) {
  if (pool === null) {
    pool = new Pool()
  }

  let preparedReq

  if (Array.isArray(reqStrings)) {
    preparedReq = reqPreparer(reqStrings, ...reqParams)
  } else {
    preparedReq = reqStrings
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
