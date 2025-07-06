const Campground = require('../models/campgrounds')
const Review = require('../models/reviews')
const AppError = require('../AppError')

module.exports.createReview = async (req, res, next) => {
    const { id } = req.params
    const campground = await Campground.findById(id).populate('author')
    if (!campground) {
        return next(new AppError('Campground not found', 404));
    }
    const review = new Review({
        body: req.body.body,
        rating: req.body.rating,
        author: req.user._id
    })
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    res.redirect(`/campgrounds/${id}`)
}

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campgrounds/${id}`)
}