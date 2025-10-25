const mongoose =require('mongoose');
const Schema=mongoose.Schema;

const UserSchema= new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique:true,
    },
   
    password:{
        type: String,
        required: true,
    },
    contact:{
        type: String,
        required: true,
    }, 
    userID:{
        type: String,
        required: true,
        unique:true,
    },
       profileImage:{              
        type: String,
        required: true,
    }
});
const UserModel =mongoose.model('user',UserSchema);
module.exports = UserModel;