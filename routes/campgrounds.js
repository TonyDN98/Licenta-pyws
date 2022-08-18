const express = require('express');
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const router = express.Router();
const ExpressError = require('../utils/ExpressError'); //ExpressError Handler
const {campgroundSchema} = require("../schemas");





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

//
router.get('/new', (req, res) => {
    res.render('places/new');
})


router.post('/', validateCampground , catchAsync(async (req, res,next) => {

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/places/${campground._id}`);
}))


// TODO: Show Place
router.get('/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('places/show', { campground });
}));

//TODO: EDIT Place
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('places/edit', { campground });
}));

//TODO: Update Place;
router.put('/:id',validateCampground, catchAsync (async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/places/${campground._id}`)
}));


//TODO:  Delete Place
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/places');
}))


module.exports = router;
