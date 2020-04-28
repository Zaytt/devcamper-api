const express = require('express');
const { getUser, getUsers, createUser, updateUser, deleteUser } = require('../controllers/users');
const User = require('../models/User');

// Include other resource router
const reviewRouter = require('./reviews');

const router = express.Router({ mergeParams: true });

const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

// Re-route into other resources router
router.use('/:userId/reviews', reviewRouter);

router.use(protect);
router.use(authorize('admin'));

router
  .route('/')
  .get(advancedResults(User), getUsers)
  .post(createUser);
router
  .route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
