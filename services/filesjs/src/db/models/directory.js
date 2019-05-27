import mongoose, { Schema } from 'mongoose'
import Boom from 'boom'


const directory = new Schema({
  name: {
    type: String,
    required: true,
  },
  directory: {
    type: Schema.Types.ObjectId,
    default: null,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
})

directory.statics.checkExistence = async function (_id) {
  const dir = await this.findById(_id)
  if (!dir) throw Boom.resourceGone('Directory does not exists', { id: _id })
  return dir
}

mongoose.model('Directory', directory)
