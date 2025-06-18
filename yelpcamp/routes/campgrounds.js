const express = require('express')
const router = express.Router()
const Campground = require('../models/campgrounds')
const catchAsyncErrors = require('../catchAsyncErrors')

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next()
    }
} 

const { campgroundSchema, reviewSchema } = require('../schemas')

router.get('/', async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', { campgrounds })
})

router.get('/new', (req, res) => {
    res.render('campgrounds/new')
})

router.post('/', validateCampground, catchAsyncErrors(async (req, res, next) => {
    const { title, location, description, price } = req.body
    const newCampground = new Campground({
        title,
        location,
        image: `https://picsum.photos/200/300?random=${Math.floor(Math.random() * 500) + 1}`,
        price,
        description
    })
    await newCampground.save()
    res.redirect(`/campgrounds/${newCampground._id}`)
}))


router.get('/:id', catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate('reviews')
    if (!campground) {
        return next(new AppError('Campground Not Found!', 404))
    }
    res.render('campgrounds/show', { campground })
}))

router.get('/:id/edit', async (req, res) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    res.render('campgrounds/edit', { campground })
})

router.put('/:id', validateCampground, catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params
    const { title, location, price, description } = req.body
    const campground = await Campground.findByIdAndUpdate(id, { title, location, price, description })
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/:id', catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findByIdAndDelete(id)
    res.redirect('/campgrounds')
}))

module.exports = router