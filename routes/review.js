
const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');
const Campground = require('../models/campground');
const Review = require('../models/review');
const reviews = require('../controllers/reviewsController');
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

// TODO : createReview() moved to ../controllers;
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

// TODO : deleteReview() moved to ../controllers;
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;