const router = require('express').Router();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const _ = require('lodash');
const { User } = require('../models/user');

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  let user = await User.findOne({ "email": req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  res.send(true);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.string().email().max(50).required(),
    password: Joi.string().min(5).max(50).required()
  });

  return schema.validate(req);
};

module.exports = router;