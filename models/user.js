const mongoose = require('mongoose');
const Joi = require('Joi');

const User = mongoose.model('User', new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    maxlength: 50,
    trim: true,
    lowercase: true,
    required: true
  },
  email: {
    type: String,
    unique: true,
    minlength: 5,
    maxlength: 50,
    trim: true,
    lowercase: true,
    required: true
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true
  }
}));

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().max(50).required(),
    password: Joi.string().min(5).max(50).required()
  });

  return schema.validate(user);
};

exports.User = User;
exports.validate = validateUser;