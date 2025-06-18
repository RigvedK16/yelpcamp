const express = require('express')
const router = express.Router()
const User = require('../models/user')
const catchAsyncErrors = require('../catchAsyncErrors')

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsyncErrors(async (req, res) => {
    const { username, email, password } = req.body;
    const user = new User({
        username: username,
        email: email
    })
    const registeredUser = await User.register(user, password)
    res.redirect('/campgrounds')

}))

module.exports = router;