const Joi = require('joi');
const mongoose = require('mongoose');

const Customer = mongoose.model('Customer', new mongoose.Schema({
  name: {
    type: String,   
    minlength: 5,
    maxlength: 50,
    required: true
  },
  isGold: {
    type: Boolean,
    default: false
  },
  phone: {
    type: String,
    minlength: 5,
    maxlength: 50,
    required: true
  }
}));

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
    phone: Joi.string().min(5).max(50).required()
  });

  return schema.validate(customer);  
}

exports.Customer = Customer;
exports.validateCustomer = validateCustomer;