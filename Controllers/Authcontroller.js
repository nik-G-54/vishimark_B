const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');
const cloudinary = require('../config/cloudinary');


const signup = async (req, res) => {
  try {
    console.log("=== SIGNUP START ===");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const { name, email, password, contact, userID } = req.body;

    // ✅ 1. Check for required image
    if (!req.file) {
      return res.status(400).json({
        message: "Profile image is required",
        success: false,
      });
    }

    // ✅ 2. Check for existing email
    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({
        message: "User with this email already exists. Please login.",
        success: false,
      });
    }

    
    const existingUserByID = await UserModel.findOne({ userID });
    if (existingUserByID) {
      return res.status(400).json({
        message: "UserID already exists. Please choose a different one.",
        success: false,
      });
    }

    // ✅ 4. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ 5. Upload image to Cloudinary
    console.log("Uploading to Cloudinary...");
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "users",
    });
    const imageUrl = result.secure_url;

    // ✅ 6. Save new user in MongoDB
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      contact,
      userID,
      profileImage: imageUrl,
    });

    await newUser.save();
    console.log("User saved in MongoDB:", newUser);

    // ✅ 7. Create JWT Token
    const token = jwt.sign(
      { _id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // ✅ 8. Send Response
    res.status(201).json({
      message: "User registered successfully",
      success: true,
      token,
      user: {
        name: newUser.name,
        email: newUser.email,
        contact: newUser.contact,
        userID: newUser.userID,
        profileImage: newUser.profileImage,
      },
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({
      message: "Internal server error during signup",
      success: false,
    });
  }
};

// ==============================
// LOGIN CONTROLLER
// ==============================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ 1. Find user
    const user = await UserModel.findOne({ email });
    const errorMsg = "Auth failed or password is incorrect";

    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    // ✅ 2. Check password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    // ✅ 3. Generate token
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // ✅ 4. Send Response
    res.status(200).json({
      message: "Login successful",
      success: true,
      token,
      user: {
        name: user.name,
        email: user.email,
        contact: user.contact,
        userID: user.userID,
        profileImage: user.profileImage,
      },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({
      message: "Internal server error during login",
      success: false,
    });
  }
};

module.exports = { signup, login };
