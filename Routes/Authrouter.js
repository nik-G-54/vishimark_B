// const { signup, login } = require('../Controllers/Authcontroller');
// const { signupValidation } = require('../Middleware/AuthValidation');
// const { loginValidation } = require('../Middleware/AuthValidation');


// const upload = require('../Middleware/multer');

// const router = require('express').Router();

// //  

// router.post('/login', loginValidation, login);
// router.post('/signup',    signupValidation ,upload.single('image'),signup);

// // router.post('/signup',signupValidation,signup);

//     module.exports =router;    



const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');
const cloudinary = require('../config/cloudinary');

const signup = async (req, res) => {
  try {
    const { name, email, password, contact, userID } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Profile image is required", success: false });
    }

    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "User with this email already exists, you can login", success: false });
    }

    const existingUserByID = await UserModel.findOne({ userID });
    if (existingUserByID) {
      return res.status(400).json({ message: "UserID already exists, please choose a different one", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await cloudinary.uploader.upload(req.file.path, { folder: "users" });
    const imageUrl = result.secure_url;

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      contact,
      userID,
      profileImage: imageUrl,
    });

    await newUser.save();

    const token = jwt.sign(
      { _id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      token,
      user: newUser
    });

  } catch (err) {
    res.status(500).json({ message: "Internal error", success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(403).json({ message: "Auth failed or password is wrong", success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(403).json({ message: "Auth failed or password is wrong", success: false });
    }

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successfully",
      success: true,
      token,
      email: user.email,
      name: user.name,
      profileImage: user.profileImage
    });

  } catch (err) {
    res.status(500).json({ message: "Internal error", success: false });
  }
};

module.exports = { signup, login };