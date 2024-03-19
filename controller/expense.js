const Expense=require('../model/expense');
// const AWS=require('aws-sdk');
// const jwt=require('jsonwebtoken');

const UserServices=require('../services/userservices');
const S3Services=require('../services/S3services');
const JwtServices=require('../services/jwtservices');

const sequelize = require('../util/database');
const FileURL=require('../model/fileurl');




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
        res.status(500).json({success:false,err:err});
    };

}


exports.getExpenses=async (req,res,next)=>{
   try{

       const expenses= await req.user.getExpenses()
      
        res.status(200).json({expenses ,ispremiumuser: req.user.ispremiumuser ,token:JwtServices.generateAccessToken(req.user.id)});
       
      
   } 
   catch(err){
        console.log(err);
        res.status(500).json({success:false,err:err});
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
            res.status(500).json({success:false,err:err});
    };

}



exports.downloadExpense=async (req,res,next)=>{
    
    try{

        // const expenses= await req.user.getExpenses();
        const expenses= await UserServices.getExpenses(req)
    
        console.log(expenses);
    
        //convert array to string as we can write string to the file
        const strigifiedExpenses =JSON.stringify(expenses);
    
        const userId=req.user.id;
        //it should depend on userID
        const filename= `Expenses${userId}/${new Date()}.txt`;
        
        const fileURL= await S3Services.uploadToS3(strigifiedExpenses, filename);
        console.log(fileURL)

        await req.user.createFileurl({
            url:fileURL
        })
    
        res.status(200).json({fileURL, success:true});
    }
    catch(err){
        console.log(err);
        res.status(500).json({fileURL:'',success:false,err:err})
    }
}


exports.getFileUrl=async (req,res,next)=>{

    try{

        const fileUrls=await req.user.getFileurls();
        res.status(200).json({fileUrls, success:true});
    }
    catch(err){
        console.log(err);
        res.status(500).json({fileURL:'',success:false,err:err})
    }

}