const express = require('express');
const { body } = require('express-validator');
const { signup, login, getProfile, updatePassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { nameRule, addressRule, emailRule, passwordRule } = require('../utils/validators');

const router = express.Router();

router.post(
  '/signup',
  [nameRule(), emailRule(), addressRule(), passwordRule()],
  validate,
  signup
);

router.post(
  '/login',
  [emailRule(), body('password').notEmpty().withMessage('Password is required')],
  validate,
  login
);

router.get('/me', authenticate, getProfile);

router.put(
  '/password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    passwordRule('newPassword'),
  ],
  validate,
  updatePassword
);

module.exports = router;
