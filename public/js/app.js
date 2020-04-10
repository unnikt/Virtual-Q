// Version 9:14

//To be set after user authentication
var gProviderID = "AUS-SYD-CAM-001";
var gID = 0;


function fbnGetServices(){
    ajax("GET","getServices?pid=AUS-SYD-CAM-001","lstSvcs"); 
}

function addService(){
    //Get values from the form
    var zName = document.getElementById('Name').value;
    var zDesc = document.getElementById('Desc').value;
    var zPrice = document.getElementById('Price').value;

    if(zName==""){
        document.getElementById("Name").setAttribute("value","Cannot be empty..");
        return;
    }

    // create the doc JSON object  ;
    var data = {"pid":gProviderID,
                doc:{"ServiceID":0,
                "ServiceName":zName,
                "ServiceDescription":zDesc,
                "Price":zPrice}
            };

    console.log(JSON.stringify(data));
    // ajax("GET","addService?pid="+gProviderID+"&doc="+doc,null);    
    //Call fetch to send the form data
    const options = {
        method:"POST",
        headers:{"content-type":"application/json"},
        body:JSON.stringify(data)
    };
    fetch("./addService",options)
        .then(response=>function(){
            fbnGetServices(); //if promise fulfilled then refresh services list
        });
}

function configService(){
    if(gDelClicked){gDelClicked=false; return;}
    alert(this.getAttribute("value"));
    console.log(this.getAttribute("value"));
}

function removeService(ele){
const sID = ele.id;
ajax("GET","remService?pid=" + gProviderID+"&sid=" + sID,null);
fbnGetServices();
}

// Call functions on the cloud
function ajax(method,request,target){
    const xhttp = new XMLHttpRequest ();
    xhttp.onreadystatechange = function(){
        if (this.readyState==4 && this.status==200){
            if (target!=null)
                document.getElementById(target).innerHTML = this.responseText;
            else
                return(this.readyState);
        }
    };
    xhttp.open(method,request);
    xhttp.send();
    return("Request sent to server...");
}


function showError(title,msg){
    var modForm = document.getElementById('modal-form'); 
    
    if(modForm==null){
        modForm = document.createElement('div');
        modForm.setAttribute('class', "modal-form");
        modForm.setAttribute('id', "modal-form");
        modForm.innerHTML = 
        "<div  class='modal-content'> \
            <h3 id='title' class='modal-header'></h3> \
            <span id='msg' style='display:block;padding:0.5em;'></span> \
            <button style='width:100px' onclick=document.getElementById('modal-form').style.display='none'>OK</button> \
        </div>"
        document.body.append(modForm);    
    } 
    document.getElementById('title').innerText = title;
    document.getElementById('msg').innerText = msg;
    document.getElementById('msg').style.display = "block";
    modForm.style.display = "block";
}