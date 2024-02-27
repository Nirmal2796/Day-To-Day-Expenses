const amount = document.getElementById('amount');
const desc = document.getElementById('description');
const category = document.getElementById('category');
// const eid=document.getElementById('id');

const form = document.querySelector('form');
const ul = document.getElementById('expense-list');



form.addEventListener('submit', onSubmit);


document.addEventListener('DOMContentLoaded', DomLoad);

async function DomLoad() {
    try{
        const res = await axios.get("http://localhost:3000/get-expenses")
        
        console.log(res.data);

            for (let i in res.data) {
                showOnScreen(res.data[i]);
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
            try{
                expense={
                    amount:amount.value,
                    description:desc.value,
                    category:category.value
                };
                let response= await axios.post("http://localhost:3000/add-expense/",expense);
                console.log(response.data.id);
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

        await axios.delete(`http://localhost:3000/delete-expense/${id}`);
        ul.removeChild(document.getElementById(id));
                                 
    }
    catch(err){
        console.log(err);
    }

}