const { Movie } = require('../models/movie');
const { Rental } = require('../models/rental');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const router = require('express').Router();
const Joi = require('joi');

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send('No rental found.');
  if (rental.dateReturned) return res.status(400).send('Rental was already processed.');
  
  rental.return();  
  await rental.save();  
  
  let movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');
  
  await Movie.updateOne({ _id: rental.movie._id }, { 
    $inc: { numberInStock: 1 }
  });

  return res.send(rental);
  
});

function validateReturn(returnedMovie) {
  const schema = Joi.object({
    movieId: Joi.objectId().required(),    
    customerId: Joi.objectId().required()
  });

  return schema.validate(returnedMovie);
}

module.exports = router;