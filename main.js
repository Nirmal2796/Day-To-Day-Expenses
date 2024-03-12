
const form=document.querySelector('form');

form.addEventListener('submit',forgotPassword);

async function forgotPassword(e){
    e.preventDefault();

    if(email.value==''){
        
        msg.innerHTML = '<b>Please enter all fields</b>';

        setTimeout(()=>{
            msg.removeChild(msg.firstChild);
        },2000);


    }
    else{
        try{

            const User={
                email:email.value,
                
            };
    
            const result= await axios.post("http://localhost:3000/password/forgotpassword",User);


            form.reset();
        }
        catch(err){

            error.innerHTML = `Error: ${err.message} , ${err.response.data}`;

            setTimeout(()=>{
                error.removeChild(error.firstChild);
            },2000);

            console.log(err.message);
            form.reset();
               
        }

    }

}