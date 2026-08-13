const express = require('express');
const { listStoresForUser, getStoreOwnerDashboard } = require('../controllers/storeController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Normal users browse/search all stores.
router.get('/', authenticate, authorize('NORMAL_USER', 'SYSTEM_ADMIN'), listStoresForUser);

// Store owner dashboard: raters + average rating for their own store.
router.get(
  '/owner/dashboard',
  authenticate,
  authorize('STORE_OWNER'),
  getStoreOwnerDashboard
);

module.exports = router;
