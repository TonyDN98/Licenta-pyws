const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const users = require('../controllers/usersController');

router.route('/register')
    .get(users.renderRegister) // TODO: renderRegister() moved to ../controllers;
    .post(catchAsync(users.register)); // TODO: Register User/Pass register()  moved to ../controllers;

router.route('/login')
    .get(users.renderLogin) // TODO: renderLogin()  moved to ../controllers;
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login)  // TODO: userLoginRedirect() moved to ../controllers;

// TODO: userLogOut  moved to ../controllers;
router.get('/logout', users.logout)

module.exports = router;