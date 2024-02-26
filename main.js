const form=document.querySelector('form');
const email=document.getElementById('email');
const password=document.getElementById('password');
const msg=document.getElementById('msg');
const error=document.getElementById('error');

form.addEventListener('submit',logInUser);


async function logInUser(e){

    e.preventDefault();

    if(email.value=='' || password.value==''){
        
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
                email:email.value,
                password:password.value
            };
    
            const result= await axios.post("http://localhost:3000/login",User);

            alert('User Logged In Successfully');

            form.reset();
        }
        catch(err){

            error.innerHTML = `Error: ${err.message} , ${err.response.data}`;
            console.log(err.message);
            form.reset();
               
        }

    }

}
