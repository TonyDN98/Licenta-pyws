const express = require('express');  // Require Express;
const catchAsync = require("../utils/catchAsync");  // req catchAsync handler
const router = express.Router(); // express router;
const flash = require('connect-flash'); // Connect Flash
const { isLoggedIn , isAuthor,validateCampground } = require('../middleware'); // require Middleware;
const placesController = require('../controllers/placesController'); // require placesControllers;



/*
*
* */


// TODO: Async function moved to ../controllers;
router.get('/', catchAsync(placesController.index));


// TODO : Call back function moved to ../controllers;
router.get('/new', isLoggedIn, placesController.rederNewForm);


// TODO: cratePlace() moved to ../controllers;
router.post('/', isLoggedIn, validateCampground, catchAsync(placesController.createPlace));


// TODO: showPlace() moved to ../controllers;
router.get('/:id', catchAsync(placesController.showPlace));

//TODO: renderEditForm() moved to ../controllers;
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(placesController.renderEditForm));


//TODO: updatePlace() moved to ../controllers;
router.put('/:id', isLoggedIn,isAuthor , validateCampground, catchAsync(placesController.updatePlace));


//TODO:  deletePlace() moved to ../controllers;
router.delete('/:id', isLoggedIn,isAuthor, catchAsync(placesController.deletePlace));


module.exports = router;
