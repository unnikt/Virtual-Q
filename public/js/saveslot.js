var data = {
    "cusid": "cusid", "cusname": "cusname", "from": "from.getTime()", "to": "to.getTime()",
    'svcid': "svcid", 'svcname': "svcname", 'pid': "pid"
};

const dtfrom = document.getElementById('dtfrom');
const dtto = document.getElementById('dtto');
dtfrom.addEventListener('change', function (e) {
    dtto.value = dtfrom.value;
    dtto.min = dtfrom.value;
});
dtfrom.value = getDateTime(Date.now());
dtto.value = getDateTime(Date.now());

document.getElementById('btnSave').addEventListener('click', saveSlot);

function saveSlot() {
    if (!validate()) return;
    const options = { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) };

    spinner();

    fetch('/saveslot', options)
        .then(res => {
            if (res.status == 200) window.location = "/calendar";
            else console.log(res.status);
            return;
        })
        .catch(err => { console.log(err) });
}
function validate() {
    data.cusname = document.getElementById('cus-name').value;
    if (data.cusname === "") { showError("Error", "Please enter the Customer name.."); return false; }

    data.cusid = document.getElementById('cus-id').value;
    if (data.cusid === "") { showError('Error', 'Email Id /  Phone number cannot be empty..'); return false; }

    data.svcname = document.getElementById('svc').value;
    if (data.svcname === "") { showError("Error", "Please select a service.."); return false; }

    data.svcid = data.svcname.slice(1, 4);

    data.from = new Date(document.getElementById('dtfrom').value);
    if (data.from == null) { showError("Error", "Please select the start date & time.."); return false; }

    data.to = new Date(document.getElementById('dtto').value);
    if (data.to == null) { showError("Error", "Please select the End date & time.."); return false; }

    data.pid = 'AUS-SYD-CAM-001';
    return true;
}