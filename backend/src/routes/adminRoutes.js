const express = require('express');
const {
  getDashboard,
  createUser,
  listUsers,
  getUserDetail,
  createStore,
  listStores,
} = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  nameRule,
  addressRule,
  emailRule,
  passwordRule,
  roleRule,
  idParamRule,
} = require('../utils/validators');

const router = express.Router();

// All admin routes require a valid token AND the SYSTEM_ADMIN role.
router.use(authenticate, authorize('SYSTEM_ADMIN'));

router.get('/dashboard', getDashboard);

router.post(
  '/users',
  [nameRule(), emailRule(), addressRule(), passwordRule(), roleRule()],
  validate,
  createUser
);

router.get('/users', listUsers);

router.get('/users/:id', [idParamRule()], validate, getUserDetail);

router.post(
  '/stores',
  [
    nameRule(),
    emailRule(),
    addressRule(),
    // ownerId is optional; validated loosely here, existence checked in controller
  ],
  validate,
  createStore
);

router.get('/stores', listStores);

module.exports = router;
