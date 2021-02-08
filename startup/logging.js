const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
  process.on('unhandledRejection', (ex) => {
    console.log('We got an unhandled rejection.');
    throw ex;
  });
  
  winston.exceptions.handle(
    new winston.transports.Console({colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }));
  
  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
  winston.add(new winston.transports.MongoDB({ 
    db: 'mongodb://localhost/vidly-dev',
    level: 'info',
    options: { 
      useUnifiedTopology: true
    }
  }));
}