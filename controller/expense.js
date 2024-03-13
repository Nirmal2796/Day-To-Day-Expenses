const Expense=require('../model/expense');
// const User = require('../model/user');
// const Sequelize = require('sequelize').Sequelize;
const sequelize = require('../util/database');

const jwt=require('jsonwebtoken');

function generateAccessToken(id){ //we will call this funciton when user has successfully logged in.
    //jst.sign({what you want to encrypt} ,  secret key); never share your secret key and dont even save it to git
    return jwt.sign({userId: id}, 'secretkey');
}


exports.postExpense=async (req,res,next)=>{

    const transaction=await sequelize.transaction();
try{


        amount=req.body.amount;
        description=req.body.description;
        category=req.body.category;

    

        const expense= await req.user.createExpense({
            amount:amount,
            description:description,
            category:category
        },{transaction:transaction});
        
        // console.log(req.user.total_expense);

        const total_expense=Number(req.user.total_expense)+Number(amount);

        await req.user.update({total_expense:total_expense},{transaction:transaction});

         (await transaction).commit();
                
        // req.user.increment('total_expense',{by:amount});

        res.status(200).json(expense);
    }
    catch(err){

        (await transaction).rollback();       
        console.log(err);
    };

}


exports.getExpenses=async (req,res,next)=>{
   try{

       const expenses= await req.user.getExpenses()
      
        res.status(200).json({expenses ,ispremiumuser: req.user.ispremiumuser ,token:generateAccessToken(req.user.id)});
       
      
   } 
   catch(err){
    console.log(err);
    };

}

exports.deleteExpense=async(req,res,next)=>{
try{

        const id=req.params.id;

        const expense=await Expense.findByPk(id);

        const e = await expense.destroy();

        const total_expense=Number(req.user.total_expense)-Number(expense.amount);

        await req.user.update({total_expense:total_expense});

        res.status(200).json({expense:expense,success:true,message:'Deleted Successfully'});


    }
        catch(err){
            console.log(err);
    };

}