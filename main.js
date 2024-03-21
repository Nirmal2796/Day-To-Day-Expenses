const amount = document.getElementById('amount');
const desc = document.getElementById('description');
const category = document.getElementById('category');

const rowsperpage=document.getElementById('rowsperpage');
// rowsperpage.defaultValue=1;

const rzp_button=document.getElementById('rzp-button');
const leaderboard_button= document.getElementById('leaderboard-button');
const download_button= document.getElementById('download-button');
const currentButton=document.getElementById('current');


const form = document.querySelector('form');
const Eul = document.getElementById('expense-list');
const ElistDiv=document.getElementById('Elist');
const LeaderBoardListDiv=document.getElementById('LeaderBoardList');
const leaderboard_list = document.getElementById('leaderboard-list');
const DownloadListDiv=document.getElementById('DownloadList');
const DownloadList = document.getElementById('download-list');
const PaginaitonList=document.getElementById('pagination');

const DownloadH5=document.getElementById('nodownload');
const ExpensesH5=document.getElementById('noexpenses');


form.addEventListener('submit', onSubmit);
rzp_button.addEventListener('click',razorpayEvent);
leaderboard_button.addEventListener('click',showLeaderBoard);
download_button.addEventListener('click',downloadExpenses);


document.addEventListener('DOMContentLoaded', DomLoad);

const page=1;


rowsperpage.onchange=async()=>{
    await getExpenses(1,rowsperpage.value);
    // currentButton.click();
}

//DOMLOAD
async function DomLoad() {
    try{
        
            await getExpenses(page,rowsperpage.value);
        
            await showDownloadedFiles();

        }
        catch(err){
        console.log(err)
        }

}

//get expenses
async function getExpenses(pageNo,rowsperpage){
    try{

        console.log(rowsperpage);

        

        const token=localStorage.getItem('token');
        const res = await axios.get(`http://localhost:3000/get-expenses?page=${pageNo}&limit=${rowsperpage}`,{headers:{"Authorization":token}});

        const expenses=res.data.expense_Data.expense;
        console.log(res.data.expense_Data.expense);

        localStorage.setItem('ispremiumuser',res.data.ispremiumuser);

        const ispremiumuser=localStorage.getItem('ispremiumuser');

        // console.log(ispremiumuser);

        if(ispremiumuser!=null && ispremiumuser=='true'){
            document.querySelector('h6').hidden=false;
            leaderboard_button.hidden=false;
            rzp_button.hidden=true;
        }

        if(expenses.length > 0){
            Eul.hidden=false;
            Eul.innerHTML='';
            for (let i in expenses) {
                showOnScreen(expenses[i]);
            }
            showPagination(res.data.expense_Data);
        }
        else{
            Eul.innerHTML='';
            ElistDiv.innerHTML=ElistDiv.innerHTML+`<h5 id='noexpenses'>No Expenses</h5>`
            // showPagination(res.data.expense_Data);
        } 

    }
    catch(err){

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
                if(Eul.hidden){
                    Eul.hidden=false;
                    ExpensesH5.hidden=true;
                }
                showOnScreen(response.data);
                showLeaderBoard();
                
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
        showLeaderBoard();
                                 
    }
    catch(err){
        console.log(err);
    }

}


//SHOW ADDED DATA ON SCREEN
function showOnScreen(obj){
 
    const child=`<li id=${obj.id} class="list-group-item"> 
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
            child=`<li id=${result.data.result[i].id} class="list-group-item"> 
                    ${result.data.result[i].uname} - 0 
                    </li>`
        }
        else{
            // console.log(result.data.result[i].user);
            child=`<li id=${result.data.result[i].id} class="list-group-item"> 
                ${result.data.result[i].uname} - ${result.data.result[i].total_expense}  
                </li>`
        }

            leaderboard_list.innerHTML=leaderboard_list.innerHTML+child;
    }

    LeaderBoardListDiv.scrollIntoView();
    
}


//Download Expenses
async function downloadExpenses(e){

    try{

        const token=localStorage.getItem('token');

        const result=await axios.get("http://localhost:3000/download",{headers:{"Authorization":token}})

        if(result.status==200){
             var a=document.createElement('a');
             a.href=result.data.fileURL;
             a.download='myexpenses.csv';
             a.click();
        }

        showDownloadedFiles();
    }
    catch(err){

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
        // console.log(response);            
        alert('something went wrong');
        await axios.post("http://localhost:3000/purchase/updatetransactionstatus",{
                order_id:options.order_id,
                payment_id:response.razorpay_payment_id,
                status:'Failed'
        },
        {headers:{"Authorization":token}});
    })


}



async function showDownloadedFiles(){

    const token=localStorage.getItem('token');

    const ispremiumuser=localStorage.getItem('ispremiumuser');
     

    if(ispremiumuser!=null && ispremiumuser=='true'){
        
        const downloadList = await axios.get("http://localhost:3000/downloaded-files",{headers:{"Authorization":token}});
        
        console.log(downloadList.data.fileUrls);

        if(downloadList.data.fileUrls.length > 0){
            
            if(DownloadList.hidden){
                DownloadList.hidden=false;
            }
            
            for (let i in downloadList.data.fileUrls) {
                
                    const child=`<li class="list-group-item"><a href=${downloadList.data.fileUrls[i].url}>
                                            ${downloadList.data.fileUrls[i].url}</a></li>`
                                            
                    DownloadList.innerHTML=DownloadList.innerHTML+child;

           }
        }
        else{
            DownloadListDiv.innerHTML=DownloadListDiv.innerHTML+`<h5 id='nodownload'>No File Downloaded</h5>`
        }
    
    
    }
    else{
        DownloadListDiv.innerHTML=DownloadListDiv.innerHTML+`<h5 id='nodownload'>Not a Premium User</h5>`
    }

}


function showPagination(pageData){

    console.log(pageData);

    // Eul.innerHTML='';

    PaginaitonList.innerHTML='';
    
    PaginaitonList.hidden=false;

    console.log(rowsperpage.value);
    

    // console.log(pageData.hasnextPage);

        if(pageData.hasPreviousPage){

            // console.log(pageData.nextPage);

            const li=document.createElement('li');

            li.className="page-item";

            const prevBtn=document.createElement('button');
            prevBtn.className="btn";
            prevBtn.innerHTML=pageData.previouePage;
            prevBtn.addEventListener('click',()=>getExpenses(pageData.previouePage,rowsperpage.value)); 

            li.appendChild(prevBtn);

            PaginaitonList.appendChild(li);

        }
        

        const li=document.createElement('li');
        li.className="page-item";

        const CurrentBtn=document.createElement('button');
        CurrentBtn.className="btn current";
        CurrentBtn.setAttribute("id","current");
        CurrentBtn.innerHTML=pageData.currentPage;
        CurrentBtn.addEventListener('click',()=>getExpenses(pageData.currentPage,rowsperpage.value)); 

        li.appendChild(CurrentBtn);

        PaginaitonList.appendChild(li);
        
       if(pageData.hasnextPage){

        // console.log(pageData.nextPage);

        const li=document.createElement('li');

        li.className="page-item mr-2";

        const nextBtn=document.createElement('button');
        nextBtn.className="btn";
        nextBtn.innerHTML=pageData.nextPage;
        nextBtn.addEventListener('click',()=>getExpenses(pageData.nextPage,rowsperpage.value)); 

       li.appendChild(nextBtn);

       PaginaitonList.appendChild(li);

    }


}