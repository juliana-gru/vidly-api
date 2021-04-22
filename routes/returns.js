// const { Return, validateReturn } = require('../models/return');
// const { Movie } = require('../models/movie');
// const { Customer } = require('../models/customer');
const { Rental } = require('../models/rental');
const auth = require('../middleware/auth');

const router = require('express').Router();
const mongoose = require('mongoose');
// const Fawn = require('fawn');

// Fawn.init(mongoose);

router.post('/', auth, async (req, res) => {
  if (!req.body.customerId) return res.status(400).send('Missing customerId.');
  if (!req.body.movieId) return res.status(400).send('Missing movieId.');

  const rental = await Rental.findOne({
    'customer._id': req.body.customerId, 
    'movie._id': req.body.movieId});    
  console.log(rental);
  if (!rental) return res.status(404).send('No rental found.');
  if (rental.dateReturned) return res.status(400).send('Rental was already processed.');
  
  rental.dateReturned = new Date();
  await rental.save();
  
  res.status(200).send('Movie succesfully returned.');
  

  // const customer = await Customer.findById(req.body.customerId);
  // if (!customer) return res.status(400).send('Invalid customer.');

  // const movie = await Movie.findById(req.body.movieId);
  // if (!movie) return res.status(400).send('Invalid movie.');

  // const rental = await Rental.find
  
  // let returnedMovie = new Return({ 
  //   customerId: req.body.customerId,
  //   movieId: req.body.movieId
  // });

  // try {
  //   new Fawn.Task()
  //     .save('returns', returnedMovie)
  //     .update('movies', {_id: movie._id }, { $inc: { numberInStock: +1 }})
  //     .update('rentals', )
  //     .run();

  //   res.send(returnedMovie); 
  // } catch(err) {
  //   res.status(500).send('Something failed');
  // }
});

module.exports = router;