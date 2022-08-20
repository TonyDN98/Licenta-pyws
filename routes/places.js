const express = require('express');  // Require Express;
const catchAsync = require("../utils/catchAsync");  // req catchAsync handler
const router = express.Router(); // express router;
const flash = require('connect-flash'); // Connect Flash
const { isLoggedIn , isAuthor,validatePlace } = require('../middleware'); // require Middleware;
const placesController = require('../controllers/placesController'); // require placesControllers;

const multer = require('multer'); // middle parse and  handel multi-form data;
const { storage } = require('../cloudinary/index');
const upload = multer({ storage }); // Store using storage;


/*
*
* */

router.route('/')
    .get(catchAsync(placesController.index)) // TODO: Async function moved to ../controllers;
    .post(isLoggedIn,upload.array('image'),validatePlace, catchAsync(placesController.createPlace)) // TODO: cratePlace() moved to ../controllers;

// TODO : Call back function moved to ../controllers;
router.get('/new', isLoggedIn, placesController.renderNewForm);

router.route('/:id')
    .get( catchAsync(placesController.showPlace))// TODO: showPlace() moved to ../controllers;
    .put( isLoggedIn,isAuthor , validatePlace, catchAsync(placesController.updatePlace))//TODO: updatePlace() moved to ../controllers;
    .delete( isLoggedIn,isAuthor, catchAsync(placesController.deletePlace));//TODO:  deletePlace() moved to ../controllers;


//TODO: renderEditForm() moved to ../controllers;
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(placesController.renderEditForm));


module.exports = router;
