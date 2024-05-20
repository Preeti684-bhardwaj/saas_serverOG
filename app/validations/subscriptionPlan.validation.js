const { body, param, query } = require('express-validator');

exports.validateSubscriptionPlanCreation = [
    body('frequency').notEmpty().withMessage('Frequency is required'),
    body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('productId').notEmpty().isUUID().withMessage('Valid Product ID is required')
];

exports.validateSubscriptionPlanUpdate = [
    param('id').isUUID().withMessage('Valid Subscription Plan ID is required'),
    body('frequency').optional(),
    body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    body('productId').optional().isUUID().withMessage('Valid Product ID is required')
];

exports.validatePaginationAndProduct = [
    query('page').optional().isInt({ min: 0 }).withMessage('Page must be a non-negative integer'),
    query('size').optional().isInt({ gt: 0 }).withMessage('Size must be a positive integer'),
    query('productId').optional().isUUID().withMessage('Valid Product ID is required')
];

