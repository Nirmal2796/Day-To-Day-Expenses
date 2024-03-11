const amount = document.getElementById('amount');
const desc = document.getElementById('description');
const category = document.getElementById('category');
const rzp_button=document.getElementById('rzp-button');
const leaderboard_button= document.getElementById('leaderboard-button');

const form = document.querySelector('form');
const Eul = document.getElementById('expense-list');
const ElistDiv=document.getElementById('Elist');
const LeaderBoardListDiv=document.getElementById('LeaderBoardList');
const leaderboard_list = document.getElementById('leaderboard-list');


form.addEventListener('submit', onSubmit);
rzp_button.addEventListener('click',razorpayEvent);
leaderboard_button.addEventListener('click',showLeaderBoard);

document.addEventListener('DOMContentLoaded', DomLoad);


//DOMLOAD
async function DomLoad() {
    try{
        const token=localStorage.getItem('token');
        const res = await axios.get("http://localhost:3000/get-expenses",{headers:{"Authorization":token}});
        
        // console.log(res.data.expenses);

        localStorage.setItem('ispremiumuser',res.data.ispremiumuser);

        const ispremiumuser=localStorage.getItem('ispremiumuser');

        // console.log(ispremiumuser);

        if(ispremiumuser!=null && ispremiumuser=='true'){
            document.querySelector('h6').hidden=false;
            leaderboard_button.hidden=false;
            rzp_button.hidden=true;
        }

        if(res.data.expenses.length > 0){
            ElistDiv.hidden=false;
            for (let i in res.data.expenses) {
                showOnScreen(res.data.expenses[i]);
           }
        }           
        }
        catch(err){
        console.log(err)
        }

}


//ADD EXPENSE
async function onSubmit(e) {
    e.preventDefault();

    if (amount.value == '' || desc.value == '') {
        msg.innerHTML = '<b>Please enter all fields</b>';

        setTimeout(() => {
            msg.removeChild(msg.firstChild);
        }, 2000);
    } 
    else {
        const token=localStorage.getItem('token');
            try{
                expense={
                    amount:amount.value,
                    description:desc.value,
                    category:category.value
                };
                let response= await axios.post("http://localhost:3000/add-expense/",expense,{headers:{"Authorization":token}});
                // console.log(response.data.id);
                if(ElistDiv.hidden){
                    ElistDiv.hidden=false;
                }
                showOnScreen(response.data);
                
            }
            catch(err){
                console.log(err);
            }

            form.reset();
        }
}



//REMOVE EXPENSE
async function removeExpense(id) {
    try{
        const token=localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/delete-expense/${id}`,{headers:{"Authorization":token}});
        Eul.removeChild(document.getElementById(id));
                                 
    }
    catch(err){
        console.log(err);
    }

}


//SHOW ADDED DATA ON SCREEN
function showOnScreen(obj){
 
    const child=`<li id=${obj.id}> 
    ${obj.category} - ${obj.amount} - ${obj.description}
    <button class='btn btn-danger btn-sm  mb-2' onClick=removeExpense(${obj.id})>Delete</button> 
    </li>`

    Eul.innerHTML=Eul.innerHTML+child;
}



//SHOW LEADERBOARD
async function showLeaderBoard(){

    const token=localStorage.getItem('token');

    const result=await axios.get("http://localhost:3000/premium/showleaderboard",{headers:{"Authorization":token}})

    console.log(result.data.result);

    LeaderBoardListDiv.hidden=false;
    
    leaderboard_list.innerHTML='';

    for(let i in result.data.result){
  
        let child;

        if(result.data.result[i].total_expense == null){
            child=`<li id=${result.data.result[i].id}> 
                    ${result.data.result[i].uname} - 0 
                    </li>`
        }
        else{
            // console.log(result.data.result[i].user);
            child=`<li id=${result.data.result[i].id}> 
                ${result.data.result[i].uname} - ${result.data.result[i].total_expense}  
                </li>`
        }

            leaderboard_list.innerHTML=leaderboard_list.innerHTML+child;
    }
    
}






//RAZORPAY 
async function razorpayEvent(e){

    const token=localStorage.getItem('token');

    const response =await axios.get("http://localhost:3000/purchase/premiummembership",{headers:{"Authorization":token}});

    // console.log(response);

    var options={
        
        "key": response.data.key_id, //key id generated from razorpay dashboard.
        "order_id": response.data.order.id, //for one time payment 
        //handler function will handle the success payment.
        "handler": async function(response){
            await axios.post("http://localhost:3000/purchase/updatetransactionstatus",{
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id,
                status:'Successful'
            },
            {headers:{"Authorization":token}});

            
            alert("You are a premium user now");
            document.querySelector('h6').hidden=false;
            rzp_button.hidden=true;
            leaderboard_button.hidden=false;
        }
    }

    //To open the razorpay window
    const rzp1=new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    //To handle payment failed.
    rzp1.on('payment.failed', async function(response){
        console.log(response);
        await axios.post("http://localhost:3000/purchase/updatetransactionstatus",{
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id,
                status:'Failed'
        },
        {headers:{"Authorization":token}});
            
        alert('something went wrong');
    })


}