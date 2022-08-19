const express = require('express');
const router = express.Router();
const passport = require('passport'); // passport
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user'); // UserModel

// TODO: /register
router.get('/register', (req, res) => {
    res.render('users/register');
});


// TODO: register user / pass
router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to PlacesYouShare!');
            res.redirect('/places');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));


// TODO: Render Login.ejs
router.get('/login', (req, res) => {
    res.render('users/login');
})


// TODO: Login Auth
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/places';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})


// TODO: Logout, redirect /places
router.get("/logout", (req, res) => {
    req.logout(req.user, err => {
        if(err) return next(err);

        req.flash('success', "See you later!");
        res.redirect("/places");
    });
});

module.exports = router;