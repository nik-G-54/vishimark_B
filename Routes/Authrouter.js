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




const User = require("../Models/User");
const { verifyToken } = require("../Middleware/authMiddleware");

router.get("/auth/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id); // use _id from JWT
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
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});