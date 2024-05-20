const express = require('express');
const passport = require('passport');
const router = express.Router();
const products = require('../controllers/product');
const authorize = require('./authorize');
const productValidation = require('../validations/product.validation');


// Create a new Product
router.post('/', passport.authenticate( 'jwt', { session: false }),authorize.authorize(['ADMIN','CUSTOMER']),productValidation.validateProductCreation, products.create);

// Retrieve all Products with pagination
router.get('/', passport.authenticate( 'jwt', { session: false }),authorize.authorize(['ADMIN','CUSTOMER']),productValidation.validatePagination, products.findAll);
router.get('/with-subscription-plans', products.findAllWithSubscriptionPlans);

// Retrieve a single Product with id
router.get('/:id',passport.authenticate( 'jwt', { session: false }),authorize.authorize(['ADMIN']), products.findOne);

// Update a Product with id
router.put('/:id',passport.authenticate( 'jwt', { session: false }),authorize.authorize(['ADMIN']), productValidation.validateProductUpdate, products.update);

// Delete a Product with id
router.delete('/:id',passport.authenticate( 'jwt', { session: false }),authorize.authorize(['ADMIN']), products.delete);

module.exports = router;

