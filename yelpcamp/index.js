const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const passport = require('passport')
const localStrategy = require('passport-local')
const session = require('express-session')
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')
    .then(() => {
        console.log("Connection established with mongoDb")
    })
    .catch((err) => {
        console.log(err)
    })

const Campground = require('./models/campgrounds')
const Review = require('./models/reviews')
const User = require('./models/user')
const AppError = require('./AppError')
const catchAsyncErrors = require('./catchAsyncErrors')
const { campgroundSchema, reviewSchema } = require('./schemas')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/user')
const { Cookies } = require('nodemailer/lib/fetch')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.engine('ejs', ejsMate)

const sessionConfig = {
    httpOnly: true,
    secret: 'idontknow', resave: false, saveUninitialized: true, cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)

app.all('*', (req, res, next) => {
    next(new AppError('Page not Found!', 404))
})

app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    if (!err.message) {
        err.message = 'Something went wrong!'
    }
    res.status(err.statusCode).render('partials/error.ejs', { err })
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
}
)
