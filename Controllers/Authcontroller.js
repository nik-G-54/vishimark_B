const bcrypt = require('bcrypt'); // thi sis a library 
// const User = require('../Models/Usermodel');
// const UserModel = require('../Models/User');
const UserModel = require('../Models/User');
const jwt = require('jsonwebtoken');


const signup = async(req,res)=>{
    try{
const {name,email,password}= req.body;
const user= await UserModel.findOne({email: email});
if(user){
    return res.status(400).json({message:"User already exists,you can login",sucess:false});
}
const newUserModel= new UserModel({name ,email,password});
newUserModel.password= await bcrypt.hash(password,10); // 10 is salt value
await newUserModel.save();
 res.status(201).json({message:"User registered successfully",sucess:true});
    }catch(err){
res.status(500).json({message:" internal error ",sucess:false});
    }
}


const login = async(req,res)=>{
    try{
const {email,password}= req.body;
const user= await UserModel.findOne({email: email});
const errorMsg=" Auth is failed or password is wrong "
if(!user){
    return res.status(403)
    .json({message: errorMsg,sucess:false});
}

const isPasswordMatch= await bcrypt.compare(password,user.password);
if(!isPasswordMatch){
    return res.status(403).json({message: errorMsg,sucess:false});
}
const jwtToken= jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET,
    {expiresIn:'24h'}
    );
 res.status(200).json({message:"login successfully",sucess:true,
 jwtToken,
 email,
    name:user.name
 });
    }catch(err){
res.status(500).json({message:" internal error ",sucess:false});
    }
}

module.exports={
    signup,
    login
}