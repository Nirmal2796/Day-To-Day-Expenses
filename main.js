
const form=document.querySelector('form');
const uname=document.getElementById('name');
const email=document.getElementById('email');
const password=document.getElementById('password');
const msg=document.getElementById('msg');
const error=document.getElementById('error');

form.addEventListener('submit',addUser);


async function addUser(e){

    e.preventDefault();

    if(uname.value=='' || email.value=='' || password.value==''){
        
        msg.innerHTML = '<b>Please enter all fields</b>';

        setTimeout(()=>{
            msg.removeChild(msg.firstChild);
        },2000);


    }
    else{
       if(error.firstChild){        
            error.removeChild(error.firstChild);
       }
        try{

            
            const User={
                uname:uname.value,
                email:email.value,
                password:password.value
            };
    
            const result= await axios.post("http://localhost:3000/signup",User);
            form.reset();
        }
        catch(err){

            error.innerHTML = `Error: ${err.message}`;
            console.log(err.message);
            form.reset();
               
        }

    }

}



