const auth = firebase.auth();
var bLoggedIn = false;

auth.onAuthStateChanged(user=>{
    if (page==='signup') window.location='index';
    if (user) {
        document.getElementById('mainNav').style.width = '100%'; 
        document.getElementById("signinform").style.display="none";
        // document.getElementById("gridicons").style.display="grid";
    }
    else
    {   document.getElementById("signinform").style.display="grid";
        document.getElementById('mainNav').style.width = '0%'; 
        // document.getElementById("gridicons").style.display="none";
        document.getElementById("errMsg").innerText="Please sign in..";
    }
    // document.getElementById("banner").style.display='none';
})