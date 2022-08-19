const express = require('express');  // Require Express;
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground'); // Require  Model
const Review = require('../models/review'); // Require Review Model
const catchAsync = require('../utils/catchAsync');  // req catchAsync handler
const {validateReview, isLoggedIn,isReviewAuthor} = require('../middleware');



// TODO : Post Review
router.post('/',isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'YAY! You posted your review!');
    res.redirect(`/places/${campground._id}`);
}))


// TODO : Delete Review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor , catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'WHATS WRONG WHY DID YOU DELETE IT ?')
    res.redirect(`/places/${id}`);
}))

module.exports = router;