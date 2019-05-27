import Joi from 'joi'
import mongoose from 'mongoose'


// eslint-disable-next-line import/prefer-default-export
export const MongooseObjectIdJoi = Joi.extend(joi => ({
  base: joi.string(),
  name: 'string',
  language: {
    isMongoObjectId: 'needs to be an ObjectId', // Used below as 'number.round'
  },
  rules: [
    {
      name: 'isMongoObjectId',
      validate(params, value, state, options) {
        if (!mongoose.Types.ObjectId.isValid(value)) return this.createError('string.isMongoObjectId', { v: value }, state, options)
        return value
      },
    },
  ],
}))
