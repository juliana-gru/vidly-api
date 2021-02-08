const express = require('express');

const error = require('../middleware/error');
const authorize = require('../middleware/auth');

const auth = require('../routes/auth');
const genresRouter = require('../routes/genres');
const customersRouter = require('../routes/customers');
const homeRouter = require('../routes/home');
const moviesRouter = require('../routes/movies');
const rentalsRouter = require('../routes/rentals');
const usersRouter = require('../routes/users');

module.exports = function(app) {
  app.use(express.json());
  app.use('/', homeRouter);
  app.use('/api/genres', genresRouter);
  app.use('/api/customers', customersRouter);
  app.use('/api/movies', moviesRouter);
  app.use('/api/rentals', authorize, rentalsRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/auth', auth);
  app.use(error); 
}