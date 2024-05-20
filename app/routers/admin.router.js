const express = require('express');
const router = express.Router();
const admins = require('../controllers/admin');
const {
    validateCreateAdmin,
    validateSignup,
    validateSignin,
    validateVerifyEmail,
    validateUpdateAdmin,
    validateFindOneAdmin,
    validateDeleteAdmin,
    validatePagination
} = require('../validations/admin.validation');

router.post('/', validateCreateAdmin, admins.create);
router.post('/signup', validateSignup, admins.signup);
router.post('/signin', validateSignin, admins.signin);
router.get('/verifyemail', validateVerifyEmail, admins.verifyEmail);
router.get('/:id', validateFindOneAdmin, admins.findOne);
router.put('/:id', validateUpdateAdmin, admins.update);
router.delete('/:id', validateDeleteAdmin, admins.delete);
router.get('/paginated', validatePagination, admins.findAllPaginated);

module.exports = router;

