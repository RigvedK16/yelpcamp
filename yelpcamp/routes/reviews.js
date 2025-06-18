const express = require('express')
const router = express.Router()
const Campground = require('./models/campgrounds')
const Review = require('./models/reviews')
const catchAsyncErrors = require('../catchAsyncErrors')
const { campgroundSchema, reviewSchema } = require('../schemas')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new AppError(msg, 400)
    } else {
        next()
    }
}

router.post('/campgrounds/:id/reviews', validateReview, catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id)
    const review = new Review({
        body: req.body.body,
        rating: req.body.rating
    })
    console.log(review)
    campground.reviews.push(review)
    console.log(campground)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${campground._id}`)
}))

router.delete('/campgrounds/:id/reviews/:reviewId', catchAsyncErrors(async (req, res, next) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router
