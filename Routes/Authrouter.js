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




const express = require("express");
const router = express.Router();

const { signup, login } = require("../Controllers/Authcontroller");
const { signupValidation, loginValidation } = require("../Middleware/AuthValidation");
const { verifyToken } = require("../Middleware/authMiddleware");
const upload = require("../Middleware/multer");
const User = require("../Models/User");

router.post("/signup", signupValidation, upload.single("image"), signup);


router.post("/login", loginValidation, login);


router.get("/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        contact: user.contact,
        userID: user.userID,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.error("Error in /auth/me:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;

