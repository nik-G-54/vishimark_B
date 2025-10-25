// const mongoose = require('mongoose');

// const mongo_url=process.env.MONGO_CONN;


// mongoose.connect(mongo_url)
// .then(()=>{
//     console.log('MONGODB CONNECT ..');
// }).catch((err)  => {
//     console.log('mongodb connection error :',err)
// })



const mongoose = require('mongoose');
require('dotenv').config(); // load .env variables

const mongo_url = process.env.MONGO_URL; // use the correct variable name

mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB connected successfully.');
})
.catch((err) => {
    console.error('MongoDB connection error:', err);
});
