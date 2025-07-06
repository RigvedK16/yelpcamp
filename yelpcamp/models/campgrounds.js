const mongoose = require('mongoose')
const Review = require('./reviews')
const User = require('./user')
const { campgroundSchema } = require('../schemas')
const campGroundSchema = new mongoose.Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
})

campGroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})

const Campground = mongoose.model('Campground', campGroundSchema)
module.exports = Campground