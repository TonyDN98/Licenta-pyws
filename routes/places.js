const express = require('express');  // Require Express;
const router = express.Router(); // Require Express Router;
const place = require('../controllers/placesController'); // Require ../placesControllers;
const catchAsync = require('../utils/catchAsync');  // Require catchAsync Handler
const { isLoggedIn, isAuthor, validatePlace } = require('../middleware');  // Require Middlewares;
const Campground = require('../models/campground');


const multer = require('multer'); // Middleware that Parse & Handel multi-form data;
const { storage } = require('../cloudinary/index');
const upload = multer({ storage }); // Store to cloudinary  using storage;



router.route('/')
    .get(catchAsync(place.index)) // TODO: Async function moved to ../controllers;
    .post(isLoggedIn,upload.array('image'), validatePlace, catchAsync(place.createPlace))  // TODO: cratePlace() moved to ../controllers;

// TODO : Call back function moved to ../controllers;
router.get('/new', isLoggedIn, place.renderNewForm)


router.route('/:id')
    .get(catchAsync(place.showPlace)) // TODO: showPlace() moved to ../controllers;
    .put(isLoggedIn, isAuthor,upload.array('image'), validatePlace, catchAsync(place.updatePlace)) //TODO: updatePlace() moved to ../controllers;
    .delete(isLoggedIn, isAuthor, catchAsync(place.deletePlace)); //TODO:  deletePlace() moved to ../controllers;

//TODO: renderEditForm() moved to ../controllers;
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(place.renderEditForm))



module.exports = router;