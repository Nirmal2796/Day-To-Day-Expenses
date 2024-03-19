const express=require('express');
const userAuthentication=require('../middleware/authentication');

const router=express.Router();

const expenseController=require('../controller/expense');

router.get('/get-expenses',userAuthentication.authenticate,expenseController.getExpenses)

router.get('/download',userAuthentication.authenticate,expenseController.downloadExpense);

router.post('/add-expense',userAuthentication.authenticate,expenseController.postExpense);

router.delete('/delete-expense/:id',userAuthentication.authenticate, expenseController.deleteExpense);

router.get('/downloaded-files',userAuthentication.authenticate,expenseController.getFileUrl);

module.exports=router;