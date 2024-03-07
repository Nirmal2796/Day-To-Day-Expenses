const express=require('express');
const userAuthentication=require('../middleware/authentication');

const PremiumController=require('../controller/premium');

const router=express.Router();

router.get('/showleaderboard',userAuthentication.authenticate,PremiumController.showLeaderBoard);


module.exports=router;