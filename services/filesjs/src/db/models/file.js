import mongoose, { Schema } from 'mongoose'
import zlib from 'zlib'
import config from 'config'
import path from 'path'
import fs from 'fs-extra'
import Boom from 'boom'


const file = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  status: {
    type: String,
    default: 'uploading',
    enum: ['uploading', 'uploaded', 'deleting', 'deleted'],
  },
  directory: {
    type: Schema.Types.ObjectId,
    default: null,
  },
  isZipped: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
})

file.methods.uploadFile = function (fileStream) {
  const element = this
  let stream = fileStream
  return new Promise(async res => {
    try {
      await fs.ensureDir(config.storage.path)
    } catch (e) {
      throw Boom.internal('Could not write file on disk', e)
    }
    const dest = await fs.createWriteStream(await element.resolveFilePath())
    if (element.isZipped) {
      stream = stream
        .pipe(zlib.createGzip())
    }
    stream
      .pipe(dest)
      .on('error', e => {
        throw Boom.internal('Could not write file on disk', e)
      })
      .on('finish', () => {
        res()
      })
  })
}

file.methods.removeFileFromDisk = async function () {
  await fs.remove(await this.resolveFilePath())
}

file.methods.resolveFilePath = async function () {
  return path.resolve(config.storage.path, this._id.toString())
}

file.methods.getFileStream = async function () {
  if (this.isZipped) {
    return fs.createReadStream(await this.resolveFilePath())
      .pipe(zlib.createGunzip())
  }
  return fs.createReadStream(await this.resolveFilePath())
}

file.statics.checkExistence = async function (_id) {
  const f = await this.findById(_id)
  if (!f) throw Boom.resourceGone('File does not exists', { id: _id })
  return f
}


mongoose.model('File', file)
