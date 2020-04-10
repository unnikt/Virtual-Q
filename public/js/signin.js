const txtEmail = document.getElementById("email");
const txtPwd = document.getElementById("password");
const btnSignIn = document.getElementById('btnSignIn');
const btnSignUp = document.getElementById("btnSignUp");
const errMsg = document.getElementById("errMsg");
const auth = firebase.auth();
var bLoggedIn = false;

// Sign In event
btnSignIn.addEventListener("click", e => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(txtEmail.value,txtPwd.value)
        .catch(e => errMsg.innerText = e.message);
});
// Sign Up even
btnSignUp.addEventListener("click", e =>{
    e.preventDefault();
    auth.createUserWithEmailAndPassword(txtEmail.value,txtPwd.value)
        .catch(e => errMsg.innerText=e.message)
});

firebase.auth().onAuthStateChanged(user=>{
    console.log(user);
    if(user)    {
        document.getElementById("signinform").style.display="none";
        document.getElementById("gridicons").style.display="grid";
    }
    else
    {   if(!bLoggedIn)
            document.getElementById("signinform").style.display="grid";
        bLoggedIn =true;
        errMsg.innerText="Please sign in..";
        btnSignIn.style.display="block";
        btnSignUp.style.display="block";
    }
})

function signOut(){
    auth.signOut();
}