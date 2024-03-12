const express=require('express');

const router=express.Router();

const forgotPasswordController=require('../controller/forgotPassword');


router.post('/password/forgotpassword',forgotPasswordController.forgotPassword);

module.exports=router