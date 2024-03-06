const Expense=require('../model/expense');

const User=require('../model/user');

const bcrypt=require('bcrypt');

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
        
        User.findOne({where:{email:email}})
        .then(user=>{
             // console.log(user);
             if(user){
                 return user;
             }
             else{
                 res.status(404).json('User Not Found');
             }
        })
        .then((user)=>{
     
         bcrypt.compare(password,user.password, (err,result)=>{
             if(err){
                 res.status(500).json({success:false,message:'Something Went Wrong'});
             }
             if(result){
                res.status(200).json({expenses ,ispremiumuser: user.ispremiumuser ,token:generateAccessToken(user.id)});
             }
             else{
                 res.status(401).json('User not authorized');
             }
         })
     
         })


        
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