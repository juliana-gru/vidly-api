const express = require('express');
const auth = require('../middleware/auth');
const { Genre, validate } = require('../models/genre');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const genres = await Genre.find().sort('name');
    res.send(genres) 
  } catch(err) {
    console.log(err.message)
  }  
});

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById({ _id: req.params.id });
  if (!genre) return res.status(404).send('The ID provided did not match any items.');

  res.send(genre);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });
  res.send(genre);  
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
  if (!genre) return res.status(404).send('Given genre was not found.');

  res.send(genre);
});

router.delete('/:id', async (req,res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);
  if (!genre) return res.status(404).send('Given genre was not found.');

  res.send(genre);
});

module.exports = router;