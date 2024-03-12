const Sib =require('sib-api-v3-sdk');

require('dotenv').config()

exports.forgotPassword=async (req,res,next)=>{

    try{

        const client=Sib.ApiClient.instance

        const api_key= client.authentications['api-key']
        api_key.apiKey=process.env.SENDINBLUE_API_KEY

        const tranEmailApi=new Sib.TransactionalEmailsApi()


        const email=req.body.email;

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
            textcontent:` Confirmation Mail`
        })

    }
    catch(err){
        console.log(err);
    }
}