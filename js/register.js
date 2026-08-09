// ==========================================
// Registration
// ==========================================

const form = document.getElementById("registrationForm");

const button = document.getElementById("continueButton");

form.addEventListener("submit", registerCustomer);

async function registerCustomer(e){

    e.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const institution =
        document.getElementById("institution").value;

    //------------------------------------------------

    if(name===""){

        alert("Please enter your full name.");

        return;

    }

    if(email===""){

        alert("Please enter your email address.");

        return;

    }

    if(institution===""){

        alert("Please choose your institution.");

        return;

    }

    //------------------------------------------------

    button.disabled = true;

    button.innerHTML = "Preparing Checkout...";

    try{

        const response = await fetch(CONFIG.WEB_APP_URL,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                action:"REGISTER_CUSTOMER",

                data:{

                    name:name,

                    email:email,

                    institution:institution

                }

            })

        });

        const result = await response.json();

        //------------------------------------------------

        if(!result.success){

            alert(result.message);

            button.disabled=false;

            button.innerHTML="Continue to Secure Checkout";

            return;

        }

        //------------------------------------------------

        sessionStorage.setItem(

            "checkoutSession",

            JSON.stringify(result)

        );

        window.location.href="checkout.html";

    }

    catch(error){

        console.error(error);

        alert("Unable to connect to the server.");

        button.disabled=false;

        button.innerHTML="Continue to Secure Checkout";

    }

}