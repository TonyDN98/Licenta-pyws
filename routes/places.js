const express = require('express');
const router = express.Router();
const place = require('../controllers/placesController');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validatePlace } = require('../middleware');

const Campground = require('../models/campground');

router.route('/')
    .get(catchAsync(place.index))
    .post(isLoggedIn, validatePlace, catchAsync(place.createPlace))

router.get('/new', isLoggedIn, place.renderNewForm)

router.route('/:id')
    .get(catchAsync(place.showPlace))
    .put(isLoggedIn, isAuthor, validatePlace, catchAsync(place.updatePlace))
    .delete(isLoggedIn, isAuthor, catchAsync(place.deletePlace));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(place.renderEditForm))



module.exports = router;