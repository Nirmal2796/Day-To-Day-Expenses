const Expense=require('../model/expense');

exports.postExpense=(req,res,next)=>{

    amount=req.body.amount;
    description=req.body.description;
    category=req.body.category;

    Expense.create({
        amount:amount,
        description:description,
        category:category
    })
    .then((expense)=>{
        res.status(200).json(expense);
    })
    .catch(err=>{
        console.log(err);
    });

}


exports.getExpenses=(req,res,next)=>{

    Expense.findAll()
    .then(expenses=>{
        res.status(200).json(expenses);
    })
    .catch(err=>{
        console.log(err);
    })

}

exports.deleteExpense=(req,res,next)=>{

    const id=req.params.id;

    Expense.findByPk(id)
    .then(expense=>{
        expense.destroy();
        res.status(200).json({success:true,message:'Deleted Successfully'});
    })
    .catch(err=> console.log(err));
   


}