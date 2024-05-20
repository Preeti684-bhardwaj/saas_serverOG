const { body, param, query } = require('express-validator');

exports.validateProductCreation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').optional(),
    body('media').optional().isObject().withMessage('Media must be a valid JSON object')
];

exports.validateProductUpdate = [
    param('id').isUUID().withMessage('Must provide a valid ID'),
    body('name').optional(),
    body('description').optional(),
    body('media').optional().isObject().withMessage('Media must be a valid JSON object')
];

exports.validatePagination = [
    query('page').optional().isInt({ min: 0 }).withMessage('Page must be a non-negative integer'),
    query('size').optional().isInt({ gt: 0 }).withMessage('Size must be a positive integer')
];

