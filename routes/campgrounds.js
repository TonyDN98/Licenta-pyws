const express = require('express');  // Require Express;
const catchAsync = require("../utils/catchAsync");  // req catchAsync handler
const Campground = require("../models/campground"); // Require Model
const router = express.Router();
const ExpressError = require('../utils/ExpressError'); //ExpressError Handler
const {campgroundSchema} = require("../schemas"); // Require the Schema
const flash = require('connect-flash'); // Connect Flash

const { isLoggedIn } = require('../middleware');




// TODO: Validate Place
const validateCampground = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        // map over error to create a single string;
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}


/*
* -------------------------------------------------------
* CRUD
* -------------------------------------------------------
* */

//TODO: wrap everything that is async and could throw an error with  catchAsync
router.get('/', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('places/index', { campgrounds })
}));


router.get('/new', isLoggedIn, (req, res) => {
    res.render('places/new');
})


router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new place!');
    res.redirect(`/places/${campground._id}`);
}))


// TODO: Show Place
router.get('/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if (!campground) {
        req.flash('error', 'Cannot find that place!');
        return res.redirect('/places');
    }
    res.render('places/show', { campground });
}));

//TODO: EDIT Place
router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
        req.flash('error', 'Cannot find that place!');
        return res.redirect('/places');
    }
    res.render('places/edit', { campground });
}));

//TODO: Update Place;
router.put('/:id', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated place!');
    res.redirect(`/places/${campground._id}`)
}));


//TODO:  Delete Place
router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted place')
    res.redirect('/places');
}))


module.exports = router;
