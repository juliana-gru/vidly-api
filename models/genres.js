const mongoose = require('mongoose');
const Joi = require('joi');

const Genre = mongoose.model('Genre', new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}));

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  });

  return schema.validate(genre);  
}

exports.Genre = Genre;
exports.validate = validateGenre;