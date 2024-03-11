const jwt=require('jsonwebtoken');

const User=require('../model/user');

exports.authenticate=async (req,res,next)=>{

    try{
        const token=req.header('Authorization');
        console.log(token);

        const user=jwt.verify(token,'secretkey');

        const user_2 = await User.findByPk(user.userId)
       
        console.log(user_2);
        req.user=user_2;
        next();
       
        
    }
    catch(err){
        console.log(err);
    }

}