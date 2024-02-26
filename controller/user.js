const User=require('../model/user');

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
            return User.create({
                uname:uname,
                email:email,
                password:password
            });
        }
   })
   .then((user)=>{
    res.status(200).json(user);
    })
   .catch(err=> console.log(err));

}


exports.postLoginUser=(req,res,next)=>{

    email=req.body.email;
    password=req.body.password;

   User.findOne({where:{email:email}})
   .then(user=>{
        // console.log(user);
        if(!user){
            res.status(404).json('User Not Found');
        }
        else{
            return user;
        }
   })
   .then((user)=>{
        if(user.password != password){
            res.status(401).json('User not authorized');
        }
        else{
            res.status(200).json(user);
        }
    })
   .catch(err=> console.log(err));

}