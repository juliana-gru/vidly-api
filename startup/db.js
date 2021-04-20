const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');
const { disable } = require('debug');


module.exports = function() {
  const db = config.get('db')
  mongoose.connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true, 
    useFindAndModify: false,
    useCreateIndex: true
  })
    .then(() => winston.info(`Connected to ${db}...`));
}
