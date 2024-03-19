const Razorpay=require('razorpay');

const Order=require('../model/order');

//we try to inform Razorpay that an order is getting created, 
// so we call razorpay url and create an order in razorpay dashboard also.
// After razorpay successfully creates an order , 
// it returns order details and we save the orderId in our order table.

exports.purchasePremium=(req,res,next)=>{

    try{

        //initialize object of razorpay with my key_id and key_secret 
        const rzp=new Razorpay({ //Now razorpay know who's company is trying to create and order
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
    
        const amount = 25000;
    
        //create order with razorpay object and pass amount , currency.
        rzp.orders.create({amount,currency:'INR'},async(err,order)=>{//callback function which get order detials on successful creation of order.
            if(err){
                throw new Error(JSON.stringify(err));
            }
            
            //we are trying to save the order details in our order table 
            await req.user.createOrder({orderId:order.id , status:'pending'})
            // .then(()=>{
                res.status(201).json({order, key_id:rzp.key_id});
            // })
            
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false,err:err});
    };


};




exports.updatetransactionstatus=async (req,res,next)=>{
    try{
        const {order_id, payment_id,status}=req.body;
    
        const order= await Order.findOne({where:{orderId:order_id}})
        
        const p1=order.update({paymentId:payment_id, status:status});
        let p2;
        if(status=='Successful'){
            p2=req.user.update({ispremiumuser:true});
        }
        else{
            p2=req.user.update({ispremiumuser:false});
        }
    
        await Promise.all([p1,p2]);
            // .then(()=>{
        res.status(202).json({message:`Transaction ${status}`});
            // })
    
    }
    catch(err){
        console.log(err);
        res.status(500).json({success:false,err:err});
    };

};