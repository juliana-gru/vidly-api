const mongoose = require('mongoose');
const Joi = require('joi');
const { genreSchema } = require('./genre');

const Movie = mongoose.model('Movie', new mongoose.Schema({
  title: {
    type: String,
    minlength: 3,
    maxlength: 50,
    trim: true,
    required: true
  },
  genre: {
    type: genreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    min: 0,
    max: 255,
    required: true
  }, 
  dailyRentalRate: {
    type: Number,
    min: 0,
    max: 255,
    required: true
  }
}));

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).max(50).required(),
    dailyRentalRate: Joi.number().min(0).max(50).required()
  });

  return schema.validate(movie);  
}

exports.Movie = Movie;
exports.validateMovie = validateMovie;