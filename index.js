const express = require('express');
const mongoose = require('mongoose');
const genresRouter = require('./routes/genres');
const homeRouter = require('./routes/home');

const app = express();

mongoose.connect('mongodb://localhost/vidly-dev', {useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(`Couldn't connect to MongoDB: `, err.message));

app.use(express.json());

app.use('/', homeRouter);
app.use('/api/genres', genresRouter);


const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));