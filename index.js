const Joi = require('joi');
const express = require('express');
const app = express();
const logger = require('./logger');
const authenticator = require('./authenticator');

app.use(express.json());

app.use(logger);
app.use(authenticator);

const genres = [
  {id: 1, name: 'Drama'},
  {id: 2, name: 'Comedy'},
  {id: 3, name: 'Romance'}
];

app.get('/api/genres', (req, res) => {
  res.send(genres);
});

app.post('/api/genres', (req, res) => {
  const genre = req.body;

  const { error } = validateGenre(genre);
  if (error) return res.status(400).send(error.details[0].message);

  genre.id = genres.length + 1;
  genres.push(genre);
  res.send(genre);
})

app.put('/api/genres/:id', (req, res) => {
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

app.delete('/api/genres/:id', (req,res) => {
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


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));