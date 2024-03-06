const express=require('express');
const userAuthentication=require('../middleware/authentication');

const router=express.Router();

const purchaseController=require('../controller/purchase');

//backend gets informed the user is trying to create an order 
router.get('/premiummembership',userAuthentication.authenticate, purchaseController.purchasePremium);

router.post('/updatetransactionstatus',userAuthentication.authenticate,purchaseController.updatetransactionstatus);

module.exports=router;