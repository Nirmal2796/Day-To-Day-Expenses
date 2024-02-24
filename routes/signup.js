const express=require('express');

const router=express.Router();

const signupController=require('../controller/signup');

router.post('/signup',signupController.postUser);


module.exports=router;