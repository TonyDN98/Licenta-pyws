const express = require('express');  // Require Express;
const catchAsync = require("../utils/catchAsync");  // req catchAsync handler
const Campground = require("../models/campground"); // Require Model
const router = express.Router();
const flash = require('connect-flash'); // Connect Flash

const { isLoggedIn , isAuthor,validateCampground } = require('../middleware'); // require Middleware;


// --------------CRUD-------------------

//TODO: wrap everything that is async and could throw an error with  catchAsync
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('places/index', { campgrounds })
}));


router.get('/new', isLoggedIn, (req, res) => {
    res.render('places/new');
})


// TODO: Create Place
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    // before place is saved;
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', "You created the place! I'm sure everyone will appreciate it for sure!");
    res.redirect(`/places/${campground._id}`);
}))


// TODO: Show Place
router.get('/:id', catchAsync(async (req, res,) => {
    // TODO: Populate Review with  their author;
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    console.log(campground);
    if (!campground) {
        req.flash('error', "We can't find this place for you rn!");
        return res.redirect('/places');
    }
    res.render('places/show', { campground });
}));

//TODO: EDIT Place
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', "We can't find this place for you rn!");
        return res.redirect('/places');
    }


    res.render('places/edit', { campground });
}));

//TODO: Update Place;
router.put('/:id', isLoggedIn,isAuthor , validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'You updated the place!');
    res.redirect(`/places/${campground._id}`)

}));


//TODO:  Delete Place
router.delete('/:id', isLoggedIn,isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'You deleted the place! Did you missed something about it? ')
    res.redirect('/places');
}))


module.exports = router;
