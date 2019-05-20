import Joi from 'joi'
import Boom from 'boom'
import { MongooseObjectIdJoi } from './custom-jois'


// TODO: eslint disabled
// eslint-disable-next-line
export const uploadFile = async (ctx, next) => {
  const schema = Joi.object().keys({
    directory: MongooseObjectIdJoi.string().isMongoObjectId(),
    name: Joi.string().required(),
    file: Joi.any().required(),
  })

  if (Joi.validate({ ...ctx.request.body, file: ctx.request.files.file }, schema).error !== null) {
    throw Boom.badRequest('Invalid body!')
  }
  await next()
}

export const generateFileOneTimeLink = async (ctx, next) => {
  const schema = Joi.object().keys({
    id: MongooseObjectIdJoi.string().isMongoObjectId().required(),
    lifeTime: Joi.number().integer(),
  })

  if (Joi.validate({ ...ctx.request.query, ...ctx.params }, schema).error !== null) {
    throw Boom.badRequest('Invalid body!')
  }
  await next()
}

export const hashValidation = async (ctx, next) => {
  const schema = Joi.object().keys({
    id: Joi.string().required(),
  })

  if (Joi.validate({ id: ctx.params.id }, schema).error !== null) {
    throw Boom.badRequest('Invalid body!')
  }
  await next()
}
