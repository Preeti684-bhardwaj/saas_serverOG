const express = require('express');
const router = express.Router();
const customers = require('../controllers/customer');
const {
    validateCreateCustomer,
    validateSignup,
    validateSignin,
    validateVerifyEmail,
    validateUpdateCustomer,
    validateFindOneCustomer,
    validateDeleteCustomer,
    validatePagination
} = require('../validations/customer.validation');

router.post('/', validateCreateCustomer, customers.create);
router.post('/signup', validateSignup, customers.signup);
router.post('/signin', validateSignin, customers.signin);
router.get('/verifyemail', validateVerifyEmail, customers.verifyEmail);
router.get('/:id', validateFindOneCustomer, customers.findOne);
router.put('/:id', validateUpdateCustomer, customers.update);
router.delete('/:id', validateDeleteCustomer, customers.delete);
router.get('/', validatePagination, customers.findAllPaginated);

module.exports = router;

