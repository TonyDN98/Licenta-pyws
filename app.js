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



// TODO: Create to local DB
mongoose.connect('mongodb://localhost:27017/pwys', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
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


// TODO: Validate Place
const validateCampground = (req,res,next) =>{
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        // map over error to create a single string;
        const msg = error.details.map(element => element.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

//TODO: Validate Review
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


// TODO: home.ejs
app.get('/', (req, res) => {
    res.render('home.ejs')
});


/*
* -------------------------------------------------------
* CRUD
* -------------------------------------------------------
* */

//TODO: wrap everything that is async and could throw an error with  catchAsync
app.get('/places', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('places/index', { campgrounds })
}));

//
app.get('/places/new', (req, res) => {
    res.render('places/new');
})


app.post('/places', validateCampground , catchAsync(async (req, res,next) => {

        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/places/${campground._id}`);
}))


// TODO: Show Place
app.get('/places/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('places/show', { campground });
}));

//TODO: EDIT Place
app.get('/places/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('places/edit', { campground });
}));

//TODO: Update Place;
app.put('/places/:id',validateCampground, catchAsync (async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/places/${campground._id}`)
}));


//TODO:  Delete Place
app.delete('/places/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/places');
}))


//TODO: Reviews
app.post('/places/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/places/${campground._id}`);
}))


// TODO: Delete reviews from a Place
app.delete('/places/:id/reviews/:reviewId', catchAsync(async (req,res) =>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull : {reviewId}}); //$pull an array of id's
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/places/${id}`);

}))




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