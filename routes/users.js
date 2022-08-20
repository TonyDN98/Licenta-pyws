const express = require('express');
const router = express.Router();
const passport = require('passport'); // passport
const catchAsync = require('../utils/catchAsync');
const userController = require('../controllers/usersControllers'); // require userControllers;


// TODO: renderUserRegister() moved to ../controllers;
router.get('/register', userController.renderUserRegister);


// TODO: Register User/Pass register()  moved to ../controllers;
router.post('/register', catchAsync(userController.register));


// TODO: renderLogin()  moved to ../controllers;
router.get('/login', userController.renderLogin);


// TODO: userLoginRedirect() moved to ../controllers;
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), userController.userLoginRedirect)


// TODO: userLogOut  moved to ../controllers;
router.get("/logout", userController.userLogOut);

module.exports = router;