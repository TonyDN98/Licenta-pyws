const express = require('express'); // Require Express;
const path = require('path'); // Req Path -> express default dir
const mongoose = require('mongoose'); // Req Mongoose;
const ejsMate = require('ejs-mate'); // req ejs mate layouts
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

// This method will be execured everytime server will get a req;
app.use(methodOverride('_method'));


// home.ejs
app.get('/', (req, res) => {
    res.render('home.ejs')
});


/*
* -------------------------------------------------------
* CRUD
* -------------------------------------------------------
* */

app.get('/places', async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('places/index', { campgrounds })
});

//
app.get('/places/new', (req, res) => {
    res.render('places/new');
})


// Save to DB;
app.post('/places', async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/places/${campground._id}`)
})


app.get('/places/:id', async (req, res,) => {
    const campground = await Campground.findById(req.params.id)
    res.render('places/show', { campground });
});

//EDIT
app.get('/places/:id/edit', async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('places/edit', { campground });
})

// Update;
app.put('/places/:id', async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/places/${campground._id}`)
});


// Delete
app.delete('/places/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/places');
})



app.listen(3000, () => {
    console.log('Serving on port 3000')
})