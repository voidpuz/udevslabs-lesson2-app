// models/Item.js

const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  quantity: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model('Item', ItemSchema);