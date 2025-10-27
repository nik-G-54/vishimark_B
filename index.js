const express = require('express');

const app = express();
const cors= require('cors'); // this is use when two different server are try to connect each other
const bodyParser =require('body-parser');  //this is used to read body data  this is type of library
const AuthRouter=require('./Routes/Authrouter.js');
const AttendanceRouter = require('./Routes/AttendanceRouter.js');
// const attendanceRoutes = require("./Routes/attendance");
require('dotenv').config();

require('./Models/db.js');

const PORT = process.env.PORT|| 8080;

app.get('/ping',(req,res)=>{
    res.send('pong');
});
// app.use("/attendance", attendanceRoutes);

const allowedOrigins = [
  "http://localhost:5173",               // <-- for your local React app
  "https://visimark-delta.vercel.app",   // <-- for your deployed frontend
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/auth',AuthRouter);
app.use('/attendance', AttendanceRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`)
})