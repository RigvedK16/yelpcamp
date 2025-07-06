const Campground = require('../models/campgrounds')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewPage = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    const { title, location, description, price } = req.body
    const newCampground = new Campground({
        title,
        location,
        image: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 500) + 1}`,
        price,
        description,
        author: req.user._id,
    })
    await newCampground.save()
    res.redirect(`/campgrounds/${newCampground._id}`)
}

module.exports.renderShowPage = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author')
    if (!campground) {
        return next(new AppError('Campground Not Found!', 404))
    } res.render('campgrounds/show', { campground })
}


module.exports.renderEditPage = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id);
    if (!campground) {
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', { campground })
}

module.exports.editCampground = async (req, res, next) => {
    const { id } = req.params
    const { title, location, price, description } = req.body
    const camp = await Campground.findByIdAndUpdate(id, { title, location, price, description })
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteCampground = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}