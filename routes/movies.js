const { Movie, validate } = require('../models/movies');
const router = require('express').Router();

router.get('/', async (req, res) => {
  const movies = await Movie.find();
  res.send(movies);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById({ _id: req.params.id });
  if (!movie) return res.status(404).send('Movie with the given id was not found.');
  res.send(movie);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  let movie = new Movie(req.body);
  movie = await movie.save();
  res.send(movie);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findOneAndUpdate(req.params.id, req.body, { new: true });
  if (!movie) res.status(404).send('Movie was not found. Failed to update');
  res.send(movie);
});

router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) res.status(404).send('Movie was not found. Failed to delete');
  res.send(movie);
});

module.exports = router;