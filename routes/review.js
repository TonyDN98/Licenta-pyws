const express = require('express');  // Require Express;
const router = express.Router({ mergeParams: true });

const Campground = require('../models/campground'); // Require  Model
const Review = require('../models/review'); // Require Review Model

const { reviewSchema } = require('../schemas.js'); // Require the Schema


const ExpressError = require('../utils/ExpressError'); //ExpressError Handler
const catchAsync = require('../utils/catchAsync');  // req catchAsync handler


// TODO: Validate Review
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


// TODO : Post Review
router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/places/${campground._id}`);
}))


// TODO : Delete Review
router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/places/${id}`);
}))

module.exports = router;