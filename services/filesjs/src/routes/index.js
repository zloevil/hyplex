import Router from 'koa-router'
import * as log4js from 'log4js'
import config from 'config'
import api from './api'
import publicApi from './public'

const log = log4js.getLogger('routers')
log.level = config.logger.logLevel

const router = new Router()
router.use(publicApi.routes(), publicApi.allowedMethods())
router.use(api.routes(), api.allowedMethods())

module.exports = router
