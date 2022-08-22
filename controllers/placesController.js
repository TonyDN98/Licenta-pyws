const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");


module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('places/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('places/new');
}

module.exports.createPlace = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', "You created the place! I'm sure everyone will appreciate it for sure!");
    res.redirect(`/places/${campground._id}`)
}

module.exports.showPlace = async (req, res,) => {
    // TODO: Populate Review with  their author;
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', "We can't find this place for you rn!");
        return res.redirect('/places');
    }
    res.render('places/show', { campground });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if (!campground) {
        req.flash('error', 'Cannot find that place!');
        return res.redirect('/places');
    }
    res.render('places/edit', { campground });
}

module.exports.updatePlace = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save() ;

    //TODO: Delete Images From Cloudinary
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        // pull from images[] where filename is in req.body.delete[]
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
    }

    req.flash('success', 'You updated the place!');
    res.redirect(`/places/${campground._id}`)
}

module.exports.deletePlace = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'You deleted the place! Did you missed something about it? ')
    res.redirect('/places');
}