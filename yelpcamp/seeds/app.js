const mongoose = require('mongoose')
const Campground = require('../models/campgrounds')
const cities = require('../seeds/cities')
const { descriptors, places } = require('../seeds/seedsHelper')
mongoose.connect('mongodb://127.0.0.1:27017/yelpcamp')
    .then(() => {
        console.log("Connection established with mongoDb")
    })
    .catch((err) => {
        console.log(err)
    })

const sample = (array) => array[Math.floor(Math.random() * array.length)]

const insertBaseData = async () => {
    for (let i = 0; i < 50; i++) {
        randomCity = Math.floor(Math.random() * cities.length) + 1
        price = Math.floor(Math.random() * 2000 + 700)
        const newCampground = new Campground({
            author: '685667406d79a7fd891532c7',
            location: `${cities[randomCity].City},${cities[randomCity].State}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: `https://picsum.photos/300?random=${Math.floor(Math.random() * 500) + 1}`,
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam cumque, quidem ducimus accusamus',
            price: price
        })
        await newCampground.save()
    }
}

insertBaseData()

