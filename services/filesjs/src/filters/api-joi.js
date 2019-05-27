import Joi from 'joi'
import Boom from 'boom'
import { MongooseObjectIdJoi } from './custom-jois'


// TODO: eslint disabled
// eslint-disable-next-line
export const uploadFile = async (ctx, next) => {
  const schema = Joi.object().keys({
    directory: MongooseObjectIdJoi.string().isMongoObjectId(),
    file: Joi.any().required(),
  })

  if (Joi.validate({ ...ctx.request.body, file: ctx.request.files.file }, schema).error !== null) {
    throw Boom.badRequest('Invalid body!')
  }
  await next()
}

export const generateFileOneTimeLink = async (ctx, next) => {
  const typeValidationSchema = Joi.object().keys({
    type: Joi.string().valid('download', 'upload', 'delete', 'move').required(),
  })

  if (Joi.validate({ type: ctx.request.body.type }, typeValidationSchema).error !== null) {
    throw Boom.badRequest('Invalid type!')
  }

  let schema

  switch (ctx.request.body.type) {
    case 'upload':
      schema = Joi.object().keys({
        type: Joi.string().valid('upload').required(),
        name: Joi.string().regex(/[a-zA-Z0-9\-_.]*/).required(),
        isZipped: Joi.boolean(),
        directory: Joi.string().regex(/[a-zA-Z0-9\-_]*/),
      })
      break
    case 'download':
      schema = Joi.object().keys({
        type: Joi.string().valid('download').required(),
        id: MongooseObjectIdJoi.string().isMongoObjectId().required(),
        lifeTime: Joi.number().integer(),
      })
      break
    default:
      throw Boom.badRequest('Invalid type!')
  }

  if (Joi.validate({ ...ctx.request.body, ...ctx.params }, schema).error !== null) {
    throw Boom.badRequest('Invalid body!')
  }
  await next()
}

export const hashValidation = async (ctx, next) => {
  const schema = Joi.object().keys({
    hash: Joi.string().required(),
  })

  if (Joi.validate({ hash: ctx.params.hash }, schema).error !== null) {
    throw Boom.badRequest('Invalid body!')
  }
  await next()
}
