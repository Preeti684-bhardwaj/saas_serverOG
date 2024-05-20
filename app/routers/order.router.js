const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller'); // Adjust the path as necessary

// Route for creating an order
router.post('/', orderController.createOrder);

module.exports = router;
