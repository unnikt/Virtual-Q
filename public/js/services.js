var btnAdd = document.getElementById('btnAdd');
var btnClose = document.getElementById('btnClose');
var btnSave = document.getElementById('btnSave')
var modform = document.getElementById('modalform');

btnAdd.addEventListener('click', showForm);
btnClose.addEventListener('click',hideform);
btnSave.addEventListener('click',addService);

function showForm() {
modform.style.display="block"; btnAdd.style.display="none"; btnClose.style.display="block";}

function hideform() {
modform.style.display="none"; btnAdd.style.display="block"; btnClose.style.display="none";}

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
var data = {"pid":'AUS-SYD-CAM-001',
            doc:{"ServiceID":0,
            "ServiceName":zName,
            "ServiceDescription":zDesc,
            "Price":zPrice}
        };

console.log(JSON.stringify(data));
const options = {
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify(data)
};

fetch("addService",options)
.then(response =>{
    console.log(response.status);
    if (response.status!==200)
        console.log(response.status);
    else
        response.text().then(result=>{
            console.log(result);
        })
    })
.catch(err=>console.log(err));
window.location.href="services";
}