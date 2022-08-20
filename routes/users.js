const express = require('express');
const router = express.Router();
const passport = require('passport'); // passport
const catchAsync = require('../utils/catchAsync');
const userController = require('../controllers/usersControllers'); // require userControllers;


router.route('/register')
    .get( userController.renderUserRegister) // TODO: renderUserRegister() moved to ../controllers;
    .post( catchAsync(userController.register)); // TODO: Register User/Pass register()  moved to ../controllers;


router.route('/login')
    .get(userController.renderLogin) // TODO: renderLogin()  moved to ../controllers;
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        userController.userLoginRedirect); // TODO: userLoginRedirect() moved to ../controllers;

// TODO: userLogOut  moved to ../controllers;
router.get("/logout", userController.userLogOut);

module.exports = router;