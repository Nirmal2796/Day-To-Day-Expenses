const User=require('../model/user');

const bcrypt=require('bcrypt');

const JwtServices=require('../services/jwtservices');

exports.postSignUpUser=async (req,res,next)=>{
    try{

        uname=req.body.uname;
        email=req.body.email;
        password=req.body.password;
    
       const user = await User.findOne({where:{email:email}})
   
        if(user){
            res.status(403).json('User Already Exists');
        }
        else{    
            bcrypt.hash(password,10,async(err,hash)=>{
            await User.create({
                uname:uname,
                email:email,
                password:hash
            });
        }) 
        
            res.status(200).json({success:true, message:'New User created Successfully'});  
        
        }
    }
    catch(err){
        // res.status(500).json({message:err, success:false});
        console.log(err);
        res.status(500).json({success:false,err:err});
    };
}





exports.postLoginUser=async (req,res,next)=>{
    try{

        email=req.body.email;
        password=req.body.password;
    
       const user=await User.findOne({where:{email:email}})
   
        if(user){
        
            bcrypt.compare(password,user.password, (err,result)=>{
                if(err){
                    res.status(500).json({success:false,message:'Something Went Wrong'});
                }
                if(result){
                    res.status(200).json({success:true, message:'User logged in Successfully' , token:JwtServices.generateAccessToken(user.id)});
                }
                else{
                    res.status(401).json('User not authorized');
                }
            })
        }
        else{
            res.status(404).json('User Not Found');
        }

    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false,err:err});
    };

}




