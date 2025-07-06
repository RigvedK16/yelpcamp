const express = require('express')
const router = express.Router()
const catchAsyncErrors = require('../catchAsyncErrors')
const campgrounds = require('../controllers/campgrounds.js')
const passport = require('passport');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js')


router.route('/')
    .get(campgrounds.index)
    .post(isLoggedIn, validateCampground, catchAsyncErrors(campgrounds.createCampground))

router.get('/new', isLoggedIn, campgrounds.renderNewPage)

router.route('/:id')
    .get(catchAsyncErrors(campgrounds.renderShowPage))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsyncErrors(campgrounds.editCampground))
    .delete(isLoggedIn, isAuthor, catchAsyncErrors(campgrounds.deleteCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsyncErrors(campgrounds.renderEditPage))

module.exports = router