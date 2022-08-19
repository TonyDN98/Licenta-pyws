// TODO: isLoggedIn MiddleWare

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // req.session.returnTo = req.originalUrl
        req.flash('error', 'First Join Us and Login PRETTY PLEASE!');
        return res.redirect('/login');
    }
    next();
}