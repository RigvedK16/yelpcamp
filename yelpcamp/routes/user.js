const express = require('express')
const router = express.Router()
const user = require('../controllers/users')
const catchAsyncErrors = require('../catchAsyncErrors')
const { storeReturnTo } = require('../middleware')
const passport = require('passport')

router.route('/register')
    .get(user.renderRegister)
    .post(catchAsyncErrors(user.register))

router.route('/login')
    .get(user.renderLogin)
    .post(storeReturnTo, passport.authenticate('local', { failureRedirect: '/login' }), user.login);

router.get('/logout', user.logout);

module.exports = router;