// const { Return, validateReturn } = require('../models/return');
const { Movie } = require('../models/movie');
// const { Customer } = require('../models/customer');
const { Rental } = require('../models/rental');
const auth = require('../middleware/auth');

const router = require('express').Router();
// const mongoose = require('mongoose');
const moment = require('moment');
// const Fawn = require('fawn');

// Fawn.init(mongoose);

router.post('/', auth, async (req, res) => {
  if (!req.body.customerId) return res.status(400).send('Missing customerId.');
  if (!req.body.movieId) return res.status(400).send('Missing movieId.');

  const rental = await Rental.findOne({
    'customer._id': req.body.customerId, 
    'movie._id': req.body.movieId});    
  
  if (!rental) return res.status(404).send('No rental found.');
  if (rental.dateReturned) return res.status(400).send('Rental was already processed.');
  
  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, 'days')
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate
  await rental.save();  
  // const customer = await Customer.findById(req.body.customerId);
  // if (!customer) return res.status(400).send('Invalid customer.');
  
  let movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');
  
  await Movie.updateOne({ _id: rental.movie._id }, { 
    $inc: { numberInStock: 1 }
  });

  res.status(200).send(rental);
  
});

module.exports = router;