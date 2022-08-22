const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'First Join Us and Login PRETTY PLEASE!');
        return res.redirect('/login');
    }
    next();
}

// TODO: Validate Place
module.exports.validatePlace = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        // map over error to create a single string;
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//TODO: isAuthor check  middleware;
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', "You don't have permission to edit this place!")
        return res.redirect(`/places/${id}`);
    }
    next();
}

//TODO: isAuthorReview check  middleware;
module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/places/${id}`);
    }
    next();
}

// TODO: Validate Review
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}