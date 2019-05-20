import Router from 'koa-router'
import Boom from 'boom'
import fs from 'fs-extra'
import {
  uploadFile as uploadFileValidation,
  // generateFileOneTimeLink as oneTimeLinkValidation,
} from '../filters/api-joi'


const uploadFile = async ctx => {
  if (ctx.request.body.directory) {
    await ctx.db.model('Directory').checkExistence(ctx.request.body.directory)
  }

  const FileModel = ctx.db.model('File')
  const file = new FileModel({
    name: ctx.request.body.name,
  })
  try {
    await file.uploadFile(fs.createReadStream(ctx.request.files.file.path))
    file.set('status', 'uploaded')
    await file.save()
  } catch (e) {
    if (e.typeof !== Boom.internal() || e.message !== 'Could not write file on disk') {
      await file.removeFileFromDisk()
    }
    throw e
  }
  ctx.body = JSON.stringify(file)
}

// const generateFileOneTimeLink = async ctx => {
//   const file = await ctx.db.model('File').checkExistence(ctx.params.id)
//   const OneTimeLink = ctx.db.model('OneTimeLink')
//   const oneTimeLink = new OneTimeLink({
//     lifeTime: ctx.request.query.lifeTime || null,
//     target: file.get('_id'),
//   })
//   await oneTimeLink.save()
//   ctx.body = JSON.stringify(oneTimeLink)
// }

const router = new Router()
router.prefix('/api')
router.post('/file', uploadFileValidation, uploadFile)
// router.get('/file/:id/generate-one-time-link', oneTimeLinkValidation, generateFileOneTimeLink)

export default router
