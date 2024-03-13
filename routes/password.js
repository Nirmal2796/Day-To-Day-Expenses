const express=require('express');

const router=express.Router();

const PasswordController=require('../controller/password');


router.post('/password/forgotpassword',PasswordController.forgotPassword);

router.get('/password/resetpassword/:uid',PasswordController.resetPassword);

router.get('/password/updatepassword/:uid',PasswordController.updatePassword);

module.exports=router