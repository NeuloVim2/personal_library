const mongoose = require('mongoose');
const db = require('../../connection');

const { Schema } = mongoose;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  comments: {
    type: Array,
    default: [],
  },
});

module.exports = db.model('Book', bookSchema);
