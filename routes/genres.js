const express = require('express');
const Genre = require('../schemas/genres');
const router = express.Router();

const Joi = require('joi');

router.get('/', async (req, res) => {
  try {
    const genres = await Genre.find().sort('name');
    res.send(genres) 
  } catch(err) {
    console.log(err.message)
  }  
});

router.post('/', async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });

  try {
    const result = await genre.save();
    res.send(result);
  } catch(err) {
    res.status(301).send(err.message);
  }
})

router.put('/:id', (req, res) => {
  const genre = genres.find(genre => genre.id === parseInt(req.params.id));

  if (!genre) return res.status(404).send('Given genre was not found.');

  const updatedGenre = req.body;

  const { error } = validateGenre(updatedGenre);
  if (error) return res.status(400).send(error.details[0].message);

  updatedGenre.id = req.params.id;
  const index = genres.indexOf(genre);
  genres.splice(index,1, updatedGenre);

  res.send(updatedGenre);
})

router.delete('/:id', (req,res) => {
  const genre = genres.find(genre => genre.id === parseInt(req.params.id));

  if (!genre) return res.status(404).send('Given genre was not found.');

  const index = genres.indexOf(genre);  
  genres.splice(index, 1);

  res.send(genre);
})

function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(3).required()
  });

  return schema.validate(genre);  
}

module.exports = router;