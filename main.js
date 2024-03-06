const amount = document.getElementById('amount');
const desc = document.getElementById('description');
const category = document.getElementById('category');
const rzp_button=document.getElementById('rzp-button');

const form = document.querySelector('form');
const ul = document.getElementById('expense-list');
const ElistDiv=document.getElementById('Elist');



form.addEventListener('submit', onSubmit);
rzp_button.addEventListener('click',razorpayEvent);


document.addEventListener('DOMContentLoaded', DomLoad);

async function DomLoad() {
    try{
        const token=localStorage.getItem('token');
        const res = await axios.get("http://localhost:3000/get-expenses",{headers:{"Authorization":token}});
        
        console.log(res.data);

        if(res.data){
            ElistDiv.hidden=false;
            for (let i in res.data) {
                showOnScreen(res.data[i]);
           }
        }
            
        }
        catch(err){
        console.log(err)
        }

}

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
                console.log(response.data.id);
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


function showOnScreen(obj){

    
    const child=`<li id=${obj.id}> 
    ${obj.category} - ${obj.amount} - ${obj.description}
    <button class='btn btn-danger btn-sm float-right mb-2' onClick=removeExpense(${obj.id})>Delete</button> 
    </li>`

    ul.innerHTML=ul.innerHTML+child;


}

async function removeExpense(id) {
    try{
        const token=localStorage.getItem('token');
        await axios.delete(`http://localhost:3000/delete-expense/${id}`,{headers:{"Authorization":token}});
        ul.removeChild(document.getElementById(id));
                                 
    }
    catch(err){
        console.log(err);
    }

}


async function razorpayEvent(e){

    const token=localStorage.getItem('token');

    const response =await axios.get("http://localhost:3000/purchase/premiummembership",{headers:{"Authorization":token}});

    console.log(response);

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