import Router from 'koa-router'
import {
  hashValidation,
} from '../filters/api-joi'


const sendFileByOneTimeLink = async ctx => {
  const { id } = ctx.params
  const file = await ctx.db.model('File').findOne({ _id: id })
  ctx.body = await file.getFileStream()
}

const router = new Router()
router.prefix('/public')
router.get('/file/:id', hashValidation, sendFileByOneTimeLink)

export default router
