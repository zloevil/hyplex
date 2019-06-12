import Router from 'koa-router'
import fs from 'fs-extra'
import Boom from 'boom'
import {
  hashValidation, uploadFile as uploadFileValidation,
} from '../filters/api-joi'


const sendFileByOneTimeLink = async ctx => {
  const { hash } = ctx.params
  const OneTimeLink = ctx.db.model('OneTimeLink')
  const link = await OneTimeLink.checkExistence(hash)
  ctx.body = await link.target.getFileStream()
  link.remove()
}


const uploadFile = async ctx => {
  const { hash } = ctx.params
  const OneTimeLink = ctx.db.model('OneTimeLink')
  const link = await OneTimeLink.checkExistence(hash)
  const file = link.target

  if (file.directory) {
    await ctx.db.model('Directory').checkExistence(file.directory)
  }

  try {
    await file.uploadFile(fs.createReadStream(ctx.request.files.file.path))
    file.set('status', 'uploaded')
    await file.save()
    await link.delete()
  } catch (e) {
    if (e.typeof !== Boom.internal() || e.message !== 'Could not write file on disk') {
      await file.removeFileFromDisk()
    }
    throw e
  }
  ctx.body = JSON.stringify(file)
}

const router = new Router()
router.prefix('/public')
router.get('/file/:hash', hashValidation, sendFileByOneTimeLink)
router.post('/file/:hash', hashValidation, uploadFileValidation, uploadFile)

export default router
