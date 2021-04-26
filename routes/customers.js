const express = require('express');
const { Customer, validateCustomer } = require('../models/customer');
const validate = require('../middleware/validate');

const router = express.Router();

router.get('/', async (req, res) => {
  const customers = await Customer.find();
  res.send(customers);  
});

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) return res.status(404).send('The ID provided did not match any customers.');
  
  res.send(customer);  
});

router.post('/', validate(validateCustomer),async (req, res) =>{  
  // const { error } = validateCustomer(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer(req.body);
  await customer.save();
  res.send(customer);
});

router.put('/:id', validate(validateCustomer), async (req, res) => {  
  // const { error } = validateCustomer(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!customer) res.status(404).send('Customer not found. Unable to update.');
  res.send(customer);
});

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(404).send('Customer not found. Check the id provided and try again.');
  res.send(`The following entry was successfully deleted: ${customer}`);
});

module.exports = router;