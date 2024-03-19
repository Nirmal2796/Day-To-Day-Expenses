const jwt=require('jsonwebtoken');

const generateAccessToken=(id)=>{ //we will call this funciton when user has successfully logged in.
    //jst.sign({what you want to encrypt} ,  secret key); never share your secret key and dont even save it to git
    return jwt.sign({userId: id}, 'secretkey');
}

module.exports={
    generateAccessToken
}