const config = require('config');

module.exports = function() {
  //Make sure env variable is set otherwise app is not going to work properly
  if (!config.get('jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
  };
};