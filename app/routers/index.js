const express = require('express');
const auth = require('./auth.router.js');
const cutomer = require('./customer.router.js');
const admin = require('./admin.router.js');
const product = require('./product.router.js');
const subscriptionPlan= require('./subscriptionPlan.router.js');
const order= require('./order.router.js');
const router = express.Router();

router.use('/auth',auth);
router.use('/customer',cutomer);
router.use('/admin',admin);
router.use('/product',product);
router.use('/order',order);
router.use('/subscriptionplan',subscriptionPlan);

module.exports = router;
