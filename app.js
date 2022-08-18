const express = require('express'); // Require Express;
const path = require('path'); // Req Path -> express default dir
const mongoose = require('mongoose'); // Req Mongoose;
const joi = require('joi'); // Req Joi Schema Validator
const ejsMate = require('ejs-mate'); // req ejs mate layouts
const {campgroundSchema, reviewSchema} = require('./schemas.js')// Require the Schema
const catchAsync = require('./utils/catchAsync'); // req catchAsync handler
const ExpressError = require('./utils/ExpressError'); //ExpressError Handler
const methodOverride = require('method-override'); // Req MethodOverride
const Campground = require('./models/campground'); // Req  the Model;
const Review = require('./models/review');// Req Review




// TODO: Prefix routes paths
const campgrounds = require('./routes/campgrounds.js');
const reviews = require('./routes/review.js');




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

//TODO: use prefix paths routes;
app.use('/places', campgrounds);
app.use('/places/:id/reviews', reviews);

// static assets
app.use(express.static(path.join(__dirname, 'public')));



// TODO: home.ejs
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