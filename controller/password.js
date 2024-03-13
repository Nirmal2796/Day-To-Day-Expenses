const Sib =require('sib-api-v3-sdk');
const bcrypt=require('bcrypt');

const sequelize = require('../util/database');

const User=require('../model/user');


const ForgotPasswordRequests=require('../model/forgotPasswordRequests');


require('dotenv').config()

const { v4: uuidv4 } = require('uuid');

exports.forgotPassword=async (req,res,next)=>{

    const transaction=await sequelize.transaction();
    try{


        const client=Sib.ApiClient.instance

        const api_key= client.authentications['api-key'];
        api_key.apiKey=process.env.SENDINBLUE_API_KEY;

        const tranEmailApi=new Sib.TransactionalEmailsApi()

        const uid=uuidv4();

        const email=req.body.email;

        const user=await User.findOne({where:{email:email}})

        if(user){
            
            await user.createForgotpasswordrequest({
                id:uid,
                isactive:true
            },{transaction:transaction}
            )
    
            // await ForgotPasswordRequests.create({
            //     id:uid,
            //     userId:user.id,
            //     isactive:true
            // },{transaction:transaction});
            
            const sender={
                email:'nirmalgadekar2796@gmail.com',
                name:'Day-To-Day Expenses'
            }
    
            const receivers=[ // array of objects, user information about the receivers
                {
                    email:email
                }
            ]
    
            await tranEmailApi.sendTransacEmail({
                sender,
                to:receivers,
                subject:'Reset Password',
                textcontent:`http://localhost:3000/password/resetpassword/{{params.uid}}`,
                params:{
                    uid:uid
                }
            })
    
           await transaction.commit();
        }
        else{

        }

    }
    catch(err){
        
        await transaction.rollback();
        console.log(err);
    }
}





exports.resetPassword=async(req,res,next)=>{

    const uid=req.params.uid;
    try{
        
        const request=await ForgotPasswordRequests.findByPk(uid);

        if(request){
            request.update({isactive:false});

            res.status(200)


            res.status(200).send(`
                                <html lang="en">
                                <head>
                                    <meta charset="UTF-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css"
                                        integrity="sha384-/Y6pD6FV/Vv2HJnA6t+vslU6fwYXjCFtcEpHbNJ0lyAFsXTsjBbfaDjzALeQsN6M" crossorigin="anonymous">
                                
                                    
                                
                                    <title>Reset Password</title>
                                </head>
                                <body>
                                
                                    
                                    <div class="page-header">
                                        <header>
                                            <h1>
                                                Day-To-Day Expense
                                            </h1> 
                                        </header>
                                    </div>
                                
                                    <div class="card card-body col-6">
                                        <div id="msg"></div>
                                        <div>
                                            <form action="/password/updatepassword/${uid}" method="get">
                                
                                                <div class="form-group row">
                                                <label for="password">Enter Password</label>
                                                <input type="password" name="password" class="form-control" required>
                                                </div>
                                
                                                <div class="form-group row">
                                                    <button  class="btn btn-primary">Reset Password</button>
                                                </div>
                                            </form>
                                        </div>
                                
                                        <div id="error"></div>
                                    </div>
                                
                                    <script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.4.0/axios.min.js"></script>
                                    <script>
                                       

                                    </script>
                                
                                </body>
                                </html>`)

            res.end();

        }
        
        

    }
    catch(err){
        console.log(err);
    }

}


exports.updatePassword=async (req,res,next)=>{
    const uid=req.params.uid;
    const newPassword=req.query.password;

    console.log("NEWPASSWORD == ",newPassword)

    const request= await ForgotPasswordRequests.findByPk(uid);
    const user=await User.findByPk(request.userId);

    console.log(user);
    bcrypt.hash(newPassword,10,async(err,hash)=>{
        
        const up = await user.update({password:hash});

        console.log(up);

        res.status(200).json({success:true, message:'Password updated Successfully', up:up});
    })

}