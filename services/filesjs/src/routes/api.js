import Router from 'koa-router'
import Boom from 'boom'
import {
  generateFileOneTimeLink as oneTimeLinkValidation,
} from '../filters/api-joi'

async function downloadOneTimeLinkHandler(ctx) {
  const { id } = ctx.request.body
  if (id === undefined) {
    throw Boom.badRequest('Id is undefined!')
  }
  const file = await ctx.db.model('File').checkExistence(id)
  const OneTimeLink = ctx.db.model('OneTimeLink')
  const oneTimeLink = new OneTimeLink({
    lifeTime: ctx.request.query.lifeTime || null,
    target: file.get('_id'),
  })
  await oneTimeLink.save()
  ctx.body = JSON.stringify(oneTimeLink)
}

async function uploadOneTimeLinkHandler(ctx) {
  const OneTimeLink = ctx.db.model('OneTimeLink')
  const File = ctx.db.model('File')
  const { name, isZipped, directory } = ctx.request.body
  const file = new File({
    name,
    isZipped,
    directory,
  })
  await file.save()

  const oneTimeLink = new OneTimeLink({
    lifeTime: ctx.request.query.lifeTime,
    action: ctx.request.body.type,
    target: file._id,
  })
  await oneTimeLink.save()
  ctx.body = JSON.stringify(oneTimeLink)
}

const generateFileOneTimeLink = async ctx => {
  switch (ctx.request.body.type) {
    case 'upload':
      await uploadOneTimeLinkHandler(ctx)
      break
    case 'download':
      await downloadOneTimeLinkHandler(ctx)
      break
    default:
      throw Boom.badRequest('Invalid type of request!')
  }
}

const router = new Router()
router.prefix('/api')
router.post('/file/generate-one-time-link', oneTimeLinkValidation, generateFileOneTimeLink)

export default router
