// Version 9:14

//To be set after user authentication
var gProviderID = "AUS-SYD-CAM-001";
var gID = 0;

const busybee = "<div style='display: flex;justify-content: center;'> \
                    <div class='lds-dual-ring'></div> \
                </div>";

function working(msg)
{   var mod_Container = document.getElementById('busy-bee');    
    if(mod_Container==null){
        mod_Container = document.createElement('div');
        mod_Container.setAttribute('class', "mod-container");
        mod_Container.setAttribute('id', "busy-bee");
        mod_Container.innerHTML = busybee
        document.body.append(mod_Container);    
    } 
    mod_Container.style.display = "block";    
}

function showError(title,msg){
    var modForm = document.getElementById('modal-form'); 
    
    if(modForm==null){
        modForm = document.createElement('div');
        modForm.setAttribute('class', "modal-form");
        modForm.setAttribute('id', "modal-form");
        modForm.innerHTML = 
        "<div  class='modal-content'> \
            <h3 id='title' class='mod-header bbdr'></h3> \
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

function deldoc(type, id, target ){
    working();
    fetch("/delete?type="+type+"&id="+id)
    .then (res =>{
        if(res.status==200) window.location=target;
        else showError('Error',"Deletion fialed...")
    })
    .catch (err =>{console.log(err);
    });
}