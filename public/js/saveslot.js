initform();
var data = {"cusid":"cusid", "cusname":"cusname","from":"from.getTime()", "to":"to.getTime()",
            'svcid':"svcid", 'svcname':"svcname",'pid':"pid"};
function initform(){
    document.getElementById('btnSave').addEventListener('click',saveSlot);
    document.getElementById('dtfrom').value = getDateTime(Date.now());
    document.getElementById('dtto').value = getDateTime(Date.now());

    document.getElementById('cus-name').setAttribute('value','John Baxter');
    document.getElementById('cus-id').setAttribute('value', 'A123');
    document.getElementById('svc-name').setAttribute('value', 'John Baxter');
}
function saveSlot(){
    if (!validate()) return;
    const options = {method:"POST", headers:{"content-type":"application/json"},body:JSON.stringify(data)};
    fetch('/savebooking',options)
    .then(res =>{ console.log(res)})
    .catch(err=>{ console.log(err)});
}
function validate(){
    data.cusname = document.getElementById('cus-name').value;
    if (data.cusname==="")
    {showError("Error","Please enter the Customer name.."); return false;}
    
    data.cusid = document.getElementById('cus-id').value;  
    if (data.cusid==="")
    {showError('Error','Email Id /  Phone number cannot be empty..'); return false;}
    
    data.svcname = document.getElementById('svc-name').value;
    if (data.svcname==="")
    {showError("Error","Please enter the service name.."); return false;}

    data.svcid = data.svcname.slice(1,4);
    
    data.from = new Date(document.getElementById('dtfrom').value);
    if (data.from==null)
    {showError("Error","Please select the start date & time.."); return false;}

    data.to = new Date(document.getElementById('dtto').value);
    if (data.to==null)
    {showError("Error","Please select the End date & time.."); return false;}
    
    data.pid = 'AUS-SYD-CAM-001';
    return true;
}