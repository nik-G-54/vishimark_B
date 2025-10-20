const mongoose = require('mongoose');

const mongo_url=process.env.MONGO_CONN;


mongoose.connect(mongo_url)
.then(()=>{
    console.log('MONGODB CONNECT ..');
}).catch((err)  => {
    console.log('mongodb connection error :',err)
})