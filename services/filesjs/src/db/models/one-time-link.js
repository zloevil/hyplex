import mongoose, { Schema } from 'mongoose'
import crypto from 'crypto'
import Boom from 'boom'


const generateHash = () => crypto
  .randomBytes(256)
  .toString('base64')
  .replace(/\W/gm, '')

const oneTimeLink = new Schema({
  hash: {
    type: String,
    required: true,
    index: true,
    default: generateHash,
  },
  action: {
    type: String,
    default: 'download',
    enum: ['download', 'upload', 'delete', 'move'],
  },
  target: {
    type: Schema.Types.ObjectId,
    default: null,
    ref: 'File',
  },
  lifeTime: {
    type: Number,
    default: 300000,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
})

oneTimeLink.statics.checkExistence = async function (hash) {
  const f = await this.findOne({ hash }).populate('target')
  if (!f) throw Boom.resourceGone('Link has expired!', { hash })
  return f
}

mongoose.model('OneTimeLink', oneTimeLink)
