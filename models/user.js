const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
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
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().max(50).required(),
    password: Joi.string().min(5).max(50).required(),
    isAdmin: Joi.boolean()
  });

  return schema.validate(user);
};

exports.userSchema = userSchema;
exports.User = User;
exports.validateUser = validateUser;