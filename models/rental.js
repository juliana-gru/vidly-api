const mongoose = require('mongoose');
const Joi = require('Joi');
const moment = require('moment');

const rentalSchema = new mongoose.Schema({
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        minlength: 3,
        maxlength: 255,
        trim: true,
        required: true
      },
      dailyRentalRate: {
        type: Number,
        min: 0,
        max: 50,
        required: true
      },      
    }),
    required: true
  },  
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
      },
      isGold: {
        type: Boolean,
        default: false
      },
      phone: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
      },
    }),
    required: true
  },
  dateOut: {
    type: Date,
    default: Date.now,
    required: true
  },
  dateReturned: { 
    type: Date
  },
  rentalFee: { 
    type: Number, 
    min: 0
  }
})

rentalSchema.statics.lookup = function(customerId, movieId) {
  return this.findOne({
    'customer._id': customerId, 
    'movie._id': movieId}); 
}

rentalSchema.methods.return = function() {
  this.dateReturned = new Date();

  const rentalDays = moment().diff(this.dateOut, 'days')
  this.rentalFee = rentalDays * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', new mongoose.Schema(rentalSchema));

function validateRental(rental) {
  const schema = Joi.object({
    movieId: Joi.objectId().required(),    
    customerId: Joi.objectId().required()
  });

  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validateRental = validateRental;