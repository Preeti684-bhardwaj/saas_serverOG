let express = require('express');
let passport = require('passport');

let router = express.Router();

const auth = require('../controllers').auth;
/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Sign up with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: User signed up successfully. A verification email has been sent.
 *       500:
 *         description: Signup failed due to server error.
 */

router.post('/api/signup',auth.signupWithEmailValidation,auth.signupWithEmail);
/**
 * @swagger
 * /api/signin:
 *   post:
 *     summary: Sign in with email and password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Registered user's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Signin successful. Token is returned.
 *       401:
 *         description: Unauthorized. Email not verified or invalid password.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Signin failed due to server error.
 */

router.post('/api/signin',auth.signupWithEmailValidation,auth.signupWithEmail);
router.get('/verify-email', auth.verifyEmail);

module.exports = router;
