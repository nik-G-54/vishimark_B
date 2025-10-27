const { signup, login } = require('../Controllers/Authcontroller');
const { signupValidation } = require('../Middleware/AuthValidation');
const { loginValidation } = require('../Middleware/AuthValidation');


const upload = require('../Middleware/multer');

const router = require('express').Router();

//  

router.post('/login',loginValidation,login);
router.post('/signup',    signupValidation ,upload.single('image'),signup);

// router.post('/signup',signupValidation,signup);

    module.exports =router;