const express = require('express');

const app = express();
const cors= require('cors'); // this is use when two different server are try to connect each other
const bodyParser =require('body-parser');  //this is used to read body data  this is type of library
const AuthRouter=require('./Routes/Authrouter.js');
const AttendanceRouter = require('./Routes/AttendanceRouter.js');

require('dotenv').config();

require('./Models/db.js');

const PORT = process.env.PORT|| 8080;

app.get('/ping',(req,res)=>{
    res.send('pong');
});

app.use(cors());// when we use   [.use ]then it is a type of malware or middleware
app.use(bodyParser.json());
app.use('/auth',AuthRouter);
app.use('/attendance', AttendanceRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})