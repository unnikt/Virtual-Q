const auth = firebase.auth();
var bLoggedIn = false;

auth.onAuthStateChanged(user=>{
    if (page==='signup') window.location='index.html';
    if(user)    {
        document.getElementById("signinform").style.display="none";
        document.getElementById("gridicons").style.display="grid";
    }
    else
    {   document.getElementById("signinform").style.display="grid";
        document.getElementById("gridicons").style.display="none";
        document.getElementById("errMsg").innerText="Please sign in..";
    }
})