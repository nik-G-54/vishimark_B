
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User');
const cloudinary = require('../config/cloudinary');

const signup = async (req, res) => {
  try {
    console.log("=== SIGNUP START ===");
    console.log("req.body:", req.body);       // Check if name/email/password exist
    console.log("req.file:", req.file);       // Check if file is uploaded

    const { name, email, password, contact, userID } = req.body;

    // Check if image is provided
    if (!req.file) {
      return res.status(400).json({
        message: "Profile image is required",
        success: false,
      });
    }

    // Check if user already exists by email
    const existingUserByEmail = await UserModel.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({
        message: "User with this email already exists, you can login",
        success: false,
      });
    }

    // Check if userID already exists
    const existingUserByID = await UserModel.findOne({ userID });
    if (existingUserByID) {
      return res.status(400).json({
        message: "UserID already exists, please choose a different one",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Upload image to Cloudinary (required)
    console.log("Uploading file to Cloudinary...");
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "users", // optional folder in Cloudinary
    });
    console.log("Cloudinary upload result:", result);
    const imageUrl = result.secure_url;

    // Create new user
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

    // Send response
    res.status(201).json({
      message: "User registered successfully",
      success: true,
      user: newUser,
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    res.status(500).json({ message: "Internal error", success: false });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    const errorMsg = "Auth failed or password is wrong";

    if (!user) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(403).json({ message: errorMsg, success: false });
    }

    const jwtToken = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successfully",
      success: true,
      jwtToken,
      email,
        // contact: Number(contact),
      // userID,
      name: user.name,
      profileImage: user.profileImage, // Include profile image URL
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Internal error", success: false });
  }
};

module.exports = { signup, login };




