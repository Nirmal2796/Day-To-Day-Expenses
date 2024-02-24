const User=require('../model/user');

exports.postUser=(req,res,next)=>{
    
    uname=req.body.uname;
    email=req.body.email;
    password=req.body.password;

   User.findOne({where:{email:email}})
   .then(user=>{
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