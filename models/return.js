// const mongoose = require('mongoose');
// const Joi = require('Joi');

// const Return = mongoose.model('Return', new mongoose.Schema({
//   customerId: {
//     type: mongoose.Types.ObjectId(),
//     required: true
//   },
//   movieId: {
//     type: mongoose.Types.ObjectId(),
//     required: true
//   },
  
// }));

// function validateReturn(returnedMovie) {
//   const schema = Joi.object({
//     movieId: Joi.objectId().required(),    
//     customerId: Joi.objectId().required()
//   });

//   return schema.validate(returnedMovie);
// }

// module.exports = Return;
// module.exports = validateReturn;