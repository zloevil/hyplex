import express from 'express'
import accountConfirmation from '../handlers/account-confirmation'

const router = express.Router()

router.use(accountConfirmation)

export default router
