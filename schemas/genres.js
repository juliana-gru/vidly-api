const mongoose = require('mongoose');

const Genre = new mongoose.model('Genre', new mongoose.Schema({
  name: {
    type: String,
    required: true,
    lowercase: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}));

module.exports = Genre;