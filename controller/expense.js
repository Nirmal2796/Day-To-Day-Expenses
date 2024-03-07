const Expense=require('../model/expense');

const jwt=require('jsonwebtoken');

function generateAccessToken(id){ //we will call this funciton when user has successfully logged in.
    //jst.sign({what you want to encrypt} ,  secret key); never share your secret key and dont even save it to git
    return jwt.sign({userId: id}, 'secretkey');
}


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
        res.status(200).json({expenses ,ispremiumuser: req.user.ispremiumuser ,token:generateAccessToken(req.user.id)});
    
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

}