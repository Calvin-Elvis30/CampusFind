const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'please provide a name'] },

  category: { type: String, required: [true, 'please specify a category'] },

  location: { type: String, required: [true, 'please name a location'] },

  status: { type: String, required: [true, 'lost or found ? '] },

  image: { type: String, required: [true, 'kindly provide image of item'] },

  createdBy: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {timestamps: true})

module.exports = mongoose.model('Item', ItemSchema)

