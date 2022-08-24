//TODO: When in production mode require cloudinary config;
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}


const express = require('express'); // Require Express;
const path = require('path');  // Require Path -> express default dir
const mongoose = require('mongoose'); // Require Mongoose;
const ejsMate = require('ejs-mate'); // Require ejs mate layouts
const session = require('express-session'); // Require Express session;
const flash = require('connect-flash'); // Connect Flash
const ExpressError = require('./utils/ExpressError'); //ExpressError Handler
const methodOverride = require('method-override'); // Require MethodOverride


const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const mongoSanitize = require('express-mongo-sanitize'); // Require Mongo Sanitize Mongo Injector

const MongoDBStore = require('connect-mongodb-session')(session);

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/pys';

// TODO: Prefix routes paths
const userRoutes = require('./routes/users');
const placesRoutes = require('./routes/places');
const reviewRoutes = require('./routes/reviews');

// TODO: Create to local DB
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


// TODO: On connect;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express(); // start express;

// TODO: Set view engine and views default directory for ejs;
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//TODO : This method will be executed everytime server will get a req; Parse the header;
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
//TODO: Static assets
app.use(express.static(path.join(__dirname, 'public')))
// TODO: Mongo Sanitize
app.use(mongoSanitize({
    replaceWith: '_'
}))

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

//TODO: Config Express Session
const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
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

passport.serializeUser(User.serializeUser()); // store a user in a session;
passport.deserializeUser(User.deserializeUser()); //  get a user out of the session;

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;  // current user session
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//TODO: Use prefix paths routes;
app.use('/', userRoutes);
app.use('/places', placesRoutes)
app.use('/places/:id/reviews', reviewRoutes)


// TODO: Render home.ejs
app.get('/', (req, res) => {
    res.render('home')
});

// TODO: In case of any request ( (*) any path);
// TODO:  This will run only if nothing matched first from above;
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

// TODO: Basic Error  Handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

// TODO: Server Port

const port = process.env.PORT || 3000;

app.listen(3000, "127.0.0.1", function(){
    console.log("The  PlacesYouShare Server Has Started!");
});

app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})

