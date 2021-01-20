const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

// const Genre = mongoose.model('Genre', genreSchema);

const Movie = mongoose.model('Movie', new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  genre: genreSchema,
  numberInStock: {
    type: Number,
    required: true
  }, 
  dailyRentalRate: {
    type: Number,
    required: true
  }
}));

function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    genre: Joi.object().required(),
    numberInStock: Joi.number().required(),
    dailyRentalRate: Joi.number().required()
  });

  return schema.validate(movie);  
}

exports.Movie = Movie;
exports.validate = validateMovie;