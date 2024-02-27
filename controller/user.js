const User=require('../model/user');

const bcrypt=require('bcrypt');

exports.postSignUpUser=(req,res,next)=>{
    
    uname=req.body.uname;
    email=req.body.email;
    password=req.body.password;

   User.findOne({where:{email:email}})
   .then(user=>{
        // console.log(user);
        if(user){
            res.status(403).json('User Already Exists');
        }
        else{

            bcrypt.hash(password,10,async(err,hash)=>{
                return User.create({
                    uname:uname,
                    email:email,
                    password:hash
                });
            })   
        }
   })
   .then((user)=>{
        res.status(200).json({success:true, message:'New User created Successfully'});
    })
   .catch(err=>{
        res.status(500).json({message:err, success:false});
   });

}


exports.postLoginUser=(req,res,next)=>{

    email=req.body.email;
    password=req.body.password;

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
            res.status(200).json({success:true, message:'User logged in Successfully'});
        }
        else{
            res.status(401).json('User not authorized');
        }
    })

    })
    .catch(err=>{
        // res.status(500).json({message:err, success:false});
        console.log(err);
   });

}