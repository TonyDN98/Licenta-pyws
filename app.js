const express = require('express'); // Require Express;
const path = require('path'); // Req Path -> express default dir
const mongoose = require('mongoose'); // Req Mongoose;
const {campgroundSchema} = require('./schemas'); // Require the Schema
const joi = require('joi'); // Req Joi Schema Validator
const ejsMate = require('ejs-mate'); // req ejs mate layouts
const catchAsync = require('./utils/catchAsync'); // req catchAsync handler
const ExpressError = require('./utils/ExpressError'); //ExpressError Handler
const methodOverride = require('method-override'); // Req MethodOverride
const Campground = require('./models/campground'); // Req  the Model;



// Create to local DB
mongoose.connect('mongodb://localhost:27017/pwys', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});


// on connect;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


const app = express(); // start express;

app.engine('ejs', ejsMate);

// Set view engine and views default directory for ejs;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// Parse the header;
app.use(express.urlencoded({ extended: true }));

// This method will be executed everytime server will get a req;
app.use(methodOverride('_method'));


const validateCampground = (req,res,next) =>{

    const {error} = campgroundSchema.validate(req.body);
    if(error){
        // map over error to create a single string;
        const msg = error.details.map(element.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}


// home.ejs
app.get('/', (req, res) => {
    res.render('home.ejs')
});


/*
* -------------------------------------------------------
* CRUD
* -------------------------------------------------------
* */

// wrap everything that is async and could throw an error with  catchAsync
app.get('/places', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('places/index', { campgrounds })
}));

//
app.get('/places/new', (req, res) => {
    res.render('places/new');
})


app.post('/places', validateCampground , catchAsync(async (req, res,next) => {
        // if(!req.body.campground){
        //     throw new ExpressError('Invalid Place Data',400) // goes to basic error handler;
        // }

        const campground = new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/places/${campground._id}`);
}))


app.get('/places/:id', catchAsync(async (req, res,) => {
    const campground = await Campground.findById(req.params.id)
    res.render('places/show', { campground });
}));

//EDIT
app.get('/places/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('places/edit', { campground });
}));

// Update;
app.put('/places/:id',validateCampground, catchAsync (async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/places/${campground._id}`)
}));


// Delete
app.delete('/places/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/places');
}))


// In case of any request ( (*) any path);
// This will run only if nothing matched first from above;
app.all('*', (req,res,next) =>{
    next(new ExpressError('Page Not Found',404))
})


// basic error  handler
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