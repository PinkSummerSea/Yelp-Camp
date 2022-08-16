if(process.env.NODE_ENV !== "production") {
    require('dotenv').config()
};

const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const geocoder = mbxGeocoding({accessToken: 'pk.eyJ1Ijoic3VtbWVyLWxpbi1vdXRsb29rIiwiYSI6ImNsNjhyMWp1ejB4ejAza28xOG12YWgyMGwifQ.tWtBOlRQTXUmzkHvl7YcfA'});

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
   
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected')
})



const sample = array => array[Math.floor(Math.random() * array.length)];

const Campground = require('../models/campground');

const seedDB = async () => {
    await Campground.deleteMany({});
    
    for (let i = 0; i < 41; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 50;
        // const geoData = await geocoder.forwardGeocode({
        //     query: location,
        //     limit: 1
        // }).send();
        const camp = new Campground({
            author: "62fb25c90c4d0f394927b1be",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            // geometry: geoData.body.features[0].geometry,
            geometry:{
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ],
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [{url:`/images/${i}.jpg`, filename:`image${i}`}, {url:`/images/${40-i}.jpg`, filename:`image${40-i}`}],
            
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias, dolor laudantium! Saepe voluptatum sapiente dolores porro cumque, veniam totam accusamus voluptates deleniti ad, nisi, praesentium obcaecati provident iure nostrum harum!",
            price
        });
        await camp.save() 
    }; 
}

seedDB().then(() => {
    mongoose.connection.close();
});