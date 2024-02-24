const User=require('../model/user');

exports.postUser=(req,res,next)=>{
    
    uname=req.body.uname;
    email=req.body.email;
    password=req.body.password;

    User.create({
        uname:uname,
        email:email,
        password:password
    })
    .then((user)=>{
        res.status(200).json(user);
    })
    .catch(err=> console.log(err));

}