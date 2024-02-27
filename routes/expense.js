const express=require('express');

const router=express.Router();

const expenseController=require('../controller/expense');

router.get('/get-expenses',expenseController.getExpenses)

router.post('/add-expense',expenseController.postExpense);

router.delete('/delete-expense/:id',expenseController.deleteExpense);

module.exports=router;