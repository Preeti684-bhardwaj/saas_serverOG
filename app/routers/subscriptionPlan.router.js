const express = require('express');
const passport = require('passport');
const router = express.Router();
const subscriptionPlanController = require('../controllers/subscriptionPlan.controller');
const subscriptionPlanValidation = require('../validations/subscriptionPlan.validation');

const authorize = require('./authorize');
// Create a new Subscription Plan
router.post('/', passport.authenticate( 'jwt', { session: false }), authorize.authorize(['ADMIN','CUSTOMER']),subscriptionPlanValidation.validateSubscriptionPlanCreation, subscriptionPlanController.create);

// Retrieve all Subscription Plans with pagination, optionally filtered by Product ID
router.get('/', passport.authenticate( 'jwt', { session: false }), authorize.authorize(['ADMIN']),subscriptionPlanValidation.validatePaginationAndProduct, subscriptionPlanController.findAll);

// Retrieve a single Subscription Plan by ID
router.get('/:id', passport.authenticate( 'jwt', { session: false }), authorize.authorize(['ADMIN']),subscriptionPlanController.findOne);

// Update a Subscription Plan by ID
router.put('/:id', passport.authenticate( 'jwt', { session: false }), authorize.authorize(['ADMIN']),subscriptionPlanValidation.validateSubscriptionPlanUpdate, subscriptionPlanController.update);

// Delete a Subscription Plan by ID
router.delete('/:id', passport.authenticate( 'jwt', { session: false }), authorize.authorize(['ADMIN']),subscriptionPlanController.delete);

// List all Subscription Plans for a specific Product
router.get('/product/:productId', passport.authenticate( 'jwt', { session: false }), authorize.authorize(['ADMIN']),subscriptionPlanController.findByProductId);

module.exports = router;

