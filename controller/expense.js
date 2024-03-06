const Expense=require('../model/expense');

exports.postExpense=(req,res,next)=>{

    amount=req.body.amount;
    description=req.body.description;
    category=req.body.category;

   

    req.user.createExpense({
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

    req.user.getExpenses()
    .then(expenses=>{
        res.status(200).json({expenses, ispremiumuser: req.user.ispremiumuser});
    })
    .catch(err=>{
        console.log(err);
    })

}

exports.deleteExpense=(req,res,next)=>{

    const id=req.params.id;

    Expense.destroy({where:{id:id, userId:req.user.id}})
    .then(expense=>{
        res.status(200).json({success:true,message:'Deleted Successfully'});
    })
    .catch(err=> console.log(err));


    // Expense.findByPk(id)
    // .then(expense=>{
    //     expense.destroy();
    //     res.status(200).json({success:true,message:'Deleted Successfully'});
    // })
    // .catch(err=> console.log(err));
   


}