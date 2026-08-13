const { body, query, param } = require('express-validator');

// --- Field-level rules, reused across auth / admin / user routes ---

const nameRule = (field = 'name') =>
  body(field)
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Name must be between 20 and 60 characters');

const addressRule = (field = 'address') =>
  body(field)
    .trim()
    .isLength({ min: 1, max: 400 })
    .withMessage('Address is required and must be at most 400 characters');

const emailRule = (field = 'email') =>
  body(field)
    .trim()
    .isEmail()
    .withMessage('A valid email address is required')
    .normalizeEmail();

const passwordRule = (field = 'password') =>
  body(field)
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\/;']/)
    .withMessage('Password must contain at least one special character');

const roleRule = (field = 'role') =>
  body(field)
    .optional()
    .isIn(['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER'])
    .withMessage('Role must be one of SYSTEM_ADMIN, NORMAL_USER, STORE_OWNER');

const ratingValueRule = (field = 'value') =>
  body(field)
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating value must be an integer between 1 and 5');

const idParamRule = (field = 'id') =>
  param(field).isInt({ min: 1 }).withMessage(`${field} must be a positive integer`);

const sortQueryRules = (allowedFields) => [
  query('sortBy')
    .optional()
    .isIn(allowedFields)
    .withMessage(`sortBy must be one of: ${allowedFields.join(', ')}`),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('sortOrder must be asc or desc'),
];

module.exports = {
  nameRule,
  addressRule,
  emailRule,
  passwordRule,
  roleRule,
  ratingValueRule,
  idParamRule,
  sortQueryRules,
};
