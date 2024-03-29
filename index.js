const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/db')();
require('./startup/routes')(app);
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod.js')(app);

const port = process.env.PORT || 3333;

const server = app.listen(port, () => winston.info(`Listening on port ${port}`));

module.exports = server;