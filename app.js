const express = require('express'); // Require Express;
const path = require('path'); // Req Path -> express default dir
const mongoose = require('mongoose'); // Req Mongoose;
const joi = require('joi'); // Req Joi Schema Validator
const ejsMate = require('ejs-mate'); // req ejs mate layouts
const session = require('express-session'); // Express session;
const flash = require('connect-flash'); // Connect Flash
const {campgroundSchema, reviewSchema} = require('./schemas.js')// Require the Schema
const catchAsync = require('./utils/catchAsync'); // req catchAsync handler
const ExpressError = require('./utils/ExpressError'); //ExpressError Handler
const methodOverride = require('method-override'); // Req MethodOverride
const Campground = require('./models/campground'); // Req  the Model;
const Review = require('./models/review');// Req Review

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');




// TODO: Prefix routes paths
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/places');
const reviewRoutes = require('./routes/review');




// TODO: Create to local DB
mongoose.connect('mongodb://localhost:27017/pwys', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


// TODO: on connect;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});



const app = express(); // start express;

app.engine('ejs', ejsMate);
// TODO: Set view engine and views default directory for ejs;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))



//TODO : This method will be executed everytime server will get a req; Parse the header;
app.use(express.urlencoded({ extended: true }));

//TODO : This method will be executed everytime server will get a req;
app.use(methodOverride('_method'));

//TODO: Static assets
app.use(express.static(path.join(__dirname, 'public')));

//TODO: Config express session
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());



// TODO: passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());// how we store a user in a session;
passport.deserializeUser(User.deserializeUser());//how to get a user out of the session;




//TODO :  Flash MiddleWare
// We take whatever is in the flash under success and put it and have access to it in locals under the key success;
app.use((req, res, next) => {
    if(!['/login', '/'].includes(req.originalUrl)){
        req.session.returnTo= req.originalUrl;
    }
    console.log(req.session)
    res.locals.currentUser = req.user; // current user session
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//TODO: Use prefix paths routes;
app.use('/', userRoutes);
app.use('/places', campgroundRoutes);
app.use('/places/:id/reviews', reviewRoutes);


// TODO: Render home.ejs
app.get('/', (req, res) => {
    res.render('home.ejs')
});




// TODO: In case of any request ( (*) any path);
// TODO:  This will run only if nothing matched first from above;
app.all('*', (req,res,next) =>{
    next(new ExpressError('Page Not Found',404))
})



// TODO: Basic error  handler
app.use((err,req,res,next)=>{
    // Destructure statusCode, message
    const {statusCode = 500} = err;
    if (! err.message ) {
        err.message = 'OH NO !Something went wrong!';
    }
    res.status(statusCode).render('error.ejs', {err}); // pass err threw template and use it in error.ejs
});




app.listen(3000, () => {
    console.log('Serving on port 3000')
})