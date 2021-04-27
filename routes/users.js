const router = require('express').Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');

const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { User, validateUser } = require('../models/user');

router.get('/me', auth, async (req, res) => {
  console.log(req.user._id);
  const user = await User.findById(req.user._id).select('-password');
  console.log(user);
  res.send(user);
})
router.post('/', validate(validateUser), async (req, res) => {
  let user = await User.findOne({ "email": req.body.email });
  if (user) return res.status(400).send('This email is already registered.');

  user = new User(_.pick(req.body, ['name', 'email', 'password']));  
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  
  res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']));
});

module.exports = router;