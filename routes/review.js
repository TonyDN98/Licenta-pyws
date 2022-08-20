const express = require('express');  // Require Express;
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');  // req catchAsync handler
const {validateReview, isLoggedIn,isReviewAuthor} = require('../middleware');
const reviewController = require('../controllers/reviewsController'); // require reviewControllers;


// TODO : createReview() moved to ../controllers;
router.post('/',isLoggedIn, validateReview, catchAsync(reviewController.createReview));


// TODO : deleteReview() moved to ../controllers;
router.delete('/:reviewId', isLoggedIn, isReviewAuthor , catchAsync(reviewController.deleteReview));

module.exports = router;