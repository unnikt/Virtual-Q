var btnAdd = document.getElementById('btnAdd');
// var btnSave = document.getElementById('btnSave');
// var btnClose = document.getElementById('btnClose');
var modform = document.getElementById('modform');
btnAdd.addEventListener('click', showform);
// btnClose.addEventListener('click', hideform);
// btnSave.addEventListener('click',savebooking);

function showform() {
    // modform.style.display="block"; btnShow.style.display="none"; btnHide.style.display="block";
    window.location = "/findaslot.html";
}





// var btnTime = document.getElementById("btnTime");  
// function refreshTime(){
//     var dt = new Date();
//     var hh = ("0"+dt.getHours()).slice(-2);
//     var mm = ("0"+dt.getMinutes()).slice(-2);
//     var ss = ("0"+dt.getSeconds()).slice(-2);
//     var ap="AM: ";
//     (hh>11) ? ap="PM: " : ap="AM: ";
//     (hh>12) ? hh-12 : hh=hh;
//     btnTime.innerText =  ap + hh+":"+mm+":"+ss;
// }
// setInterval(refreshTime,1000);
