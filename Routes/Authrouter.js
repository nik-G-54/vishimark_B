const { signup } = require('../Controllers/Authcontroller');
const { signupValidation } = require('../Middleware/AuthValidation');

const router = require('express').Router();

router.post('/login',(req,res)=>{
    res.send('login success');
});

// router.post('/login',loginValidation,login);
router.post('/signup',signupValidation,signup);
// router.post('/signup',signupValidation,signup);

    module.exports =router;