const { body, param, query } = require('express-validator');

exports.validateCreateCustomer = [
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phone').optional().isMobilePhone().withMessage('Must be a valid phone number')
];

exports.validateSignup = [
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

exports.validateSignin = [
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('password').exists().withMessage('Password is required')
];

exports.validateVerifyEmail = [
    query('token').exists().withMessage('Token is required')
];

exports.validateUpdateCustomer = [
    param('id').isUUID().withMessage('Must be a valid UUID'),
    body('email').optional().isEmail().withMessage('Must be a valid email address'),
    body('phone').optional().isMobilePhone().withMessage('Must be a valid phone number')
];

exports.validateFindOneCustomer = [
    param('id').isUUID().withMessage('Must be a valid UUID')
];

exports.validateDeleteCustomer = [
    param('id').isUUID().withMessage('Must be a valid UUID')
];

exports.validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Page must be a non-negative integer'),
    query('size')
        .optional()
        .isInt({ gt: 0 })
        .withMessage('Size must be a positive integer')
];
