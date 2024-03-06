const jwt=require('jsonwebtoken');

const User=require('../model/user');

exports.authenticate=(req,res,next)=>{

    try{
        const token=req.header('Authorization');
        console.log(token);

        const user=jwt.verify(token,'secretkey');

        User.findByPk(user.userId)
        .then(user=>{
            console.log(user);
            req.user=user;
            next();
        })
        
    }
    catch(err){
        console.log(err);
    }

}