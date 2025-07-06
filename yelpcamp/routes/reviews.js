const express = require('express')
const router = express.Router({ mergeParams: true })
const catchAsyncErrors = require('../catchAsyncErrors')
const reviews = require('../controllers/reviews')
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const { authorize } = require('passport')


router.post('/', isLoggedIn, validateReview, catchAsyncErrors(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsyncErrors(reviews.deleteReview))

module.exports = router
