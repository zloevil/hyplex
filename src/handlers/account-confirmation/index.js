import express from 'express'
import * as log4js from 'log4js'
import config from 'config'
import User from '../../db/models/User'

const log = log4js.getLogger('handlers.account-confirmation>')
log.level = config.logger.level

const router = express.Router()
// get emails list
router.get('/verify/:eventId', async (req, res) => {
  const { eventId } = req.params
  if (!eventId) {
    return res.boom.badRequest('Invalid link!')
  }
  try {
    const result = await User.getUserIdByEventId(eventId)
    if (Array.isArray(result)) {
      return res.boom.badRequest('Invalid link!')
    }

    await User.confirmAccount(result.user_id)

    return res
      .redirect('/')
  } catch (e) {
    log.error('> Error while getting an emails list!\n', e)
  }
  return res
    .boom
    .badRequest('Internal server error!')
})


export default router
