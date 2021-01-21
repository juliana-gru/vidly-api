const express = require('express');
const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const genresRouter = require('./routes/genres');
const customersRouter = require('./routes/customers');
const homeRouter = require('./routes/home');
const moviesRouter = require('./routes/movies');
const rentalsRouter = require('./routes/rentals');

const app = express();

mongoose.connect('mongodb://localhost/vidly-dev', {useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(`Couldn't connect to MongoDB: `, err.message));

app.use(express.json());

app.use('/', homeRouter);
app.use('/api/genres', genresRouter);
app.use('/api/customers', customersRouter);
app.use('/api/movies', moviesRouter);
app.use('/api/rentals', rentalsRouter);


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));