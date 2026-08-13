const express = require('express');
const { upsertRating, deleteRating } = require('../controllers/ratingController');
const { authenticate, authorize } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { ratingValueRule, ratingCommentRule, idParamRule } = require('../utils/validators');

const router = express.Router();

router.post(
  '/:storeId',
  authenticate,
  authorize('NORMAL_USER'),
  [idParamRule('storeId'), ratingValueRule(), ratingCommentRule()],
  validate,
  upsertRating
);

router.delete(
  '/:storeId',
  authenticate,
  authorize('NORMAL_USER'),
  [idParamRule('storeId')],
  validate,
  deleteRating
);

module.exports = router;
