var user = { fname: '', sname: '', email: '', phone: '', notify: '' }
var slot = { bid: '', bname: '', uid: '', sid: '', svc: '', start: '', end: '' };

var VERIFIED = false;
get('dvCustomer').style.display = 'block';
function clk_tab(dv, ic) {
    const dvStyle = get(dv).style;
    if ((dvStyle.display == 'none') || (dvStyle.display == '')) {
        preTab(dv);
        dvStyle.display = 'block';
    }
    else {
        VERIFIED = false;
        switch (dv) { //Verify Data entered
            case ('dvCustomer'): verifyUser(); break;
            case ('dvCalendar'): verifyDate(); break;
            default: VERIFIED = true; break;
        }
        if (VERIFIED) {
            dvStyle.display = 'none';
            setIcnClr(ic); VERIFIED = false;
            nextTab(dv, ic);
        }
    }
}
const preTab = async (dv) => {
    switch (dv) { //Preprocess if necessary
        case ('dvServices'): loadServices(); break;
        case ('dvTimePicker'): showTimePicker(); break;
        case ('dvResources'): loadResources(); break;
    }
}
const nextTab = async (dv) => {
    switch (dv) { //Next step
        case ('dvCustomer'): clk_tab('dvServices', 'icn02'); break;
        case ('dvServices'): clk_tab('dvCalendar', 'icn03'); break;
        case ('dvCalendar'): clk_tab('dvTimePicker', 'icn04'); break;
        case ('dvTimePicker'): clk_tab('dvResources', 'icn05'); break;
    }
}

var bUserVerified = false;
const verifyUser = async () => {
    const email = get('email').value; const phone = get('phone').value;
    if ((get('fname').value == user.fname) && (get('sname').value == user.sname) && (email == user.email) && (phone == user.phone))
        VERIFIED = bUserVerified = true;
    else if (email.length < 8) toast("Please enter a valid email id!");
    else if (phone.length < 8) toast("Please enter a valid phone!");
    else {
        const params = { method: 'POST', headers: { 'Accept': 'application/json' }, body: JSON.stringify({ phone: phone, email: email }) };

        spinner();
        const response = await fetch('verifyuser', params);
        const result = await response.json();
        spinner('stop');

        if (result.code == 1) { bUserVerified = true; VERIFIED = true; setUser(); }
        else toast(result.msg);
    }
}
function searchUser() {
    const srchText = get('inpSearch').value;
    if (srchText.length < 8) toast("Please enter a valid email id or Phone number!");
    else {
        const params = {
            method: 'POST', headers: { 'Accept': 'application/json' },
            body: JSON.stringify({ field: isNaN(srchText) ? 'email' : 'phone', value: srchText })
        };
        spinner();
        fetch('finduser', params)
            .then(response => response.json()
                .then(data => { showResults(data.results); spinner('stop'); })
                .catch(err => { toast(err); spinner('stop'); }))
            .catch(err => { toast(err); spinner('stop'); })
    }
}
function showResults(results) {
    if (results.length > 0) {
        get('selCustomer').style.display = 'block';
        results.forEach(cust => {
            const newdiv = create('a'); newdiv.innerText = [cust.fname, cust.sname].join(' ');
            newdiv.addEventListener('click', e => {
                get('fname').value = cust.fname; get('sname').value = cust.sname;
                get('email').value = cust.email; get('phone').value = cust.phone;
                slot.uid = cust.uid; setUser();
                get('selCustomer').style.display = 'none';
            });
            const divsrchResult = get('srchResult'); divsrchResult.innerHTML = "";
            divsrchResult.appendChild(newdiv);
        });
    }
}

function setUser() {
    user.fname = get('fname').value; user.sname = get('sname').value;
    user.email = get('email').value; user.phone = get('phone').value;
    get('lblCustomer').innerText = [user.fname, user.sname].join(' ');
    bUserVerified = true;
    clk_tab('dvCustomer', 'icn01');
}

var selSvc = null;
function saveService(sid, sname) {
    slot.sid = sid; slot.svc = sname;
    if (selSvc) selSvc.background = 'var(--secondary-color)';
    selSvc = get(sid).style; selSvc.background = 'var(--primary-color)';
    get('lblService').innerText = sname;
    clk_tab('dvServices', 'icn02');
}

function verifyDate() {
    const selDt = get('lblDate').innerText = get('date').innerText;
    VERIFIED = (selDt) ? true : false;
}

function findResources() {
    const payload = { bid: bid, sid: sid, date: selDate };
    const params = { method: 'POST', headers: { 'Accept': 'application/json' }, body: JSON.stringify(payload) };
    fetch('/findResources', params)
        .then(res => res.json()
            .then(data => console.log(data))
            .catch(err => console.log(err)))
        .catch(err => console.log(err))
}

function setNotify() {
    user.notify = "";
    if (get('notem').checked) user.notify = 'email';
    if (get('nottel').checked) user.notify += '|phone';
    get('submit').disabled = (user.notify.length > 1) ? false : true;
}

var SAVE_READY = false; var msg;
function validate() {
    if (!user.fname) return "First name is required";
    if (!user.sname) return "Sur name is required";
    if (!user.email) return "Email required";
    if (!user.phone) return "Phone number is required";
    if ((!slot.bid) || (!slot.bname)) return "Business info unavailable..";
    if (!slot.sid) return "No Service selected";
    if (!slot.start) return "Start time is not selected";
    if (!slot.end) return "End time is not selected";
    return null;
}

function saveBooking() {
    const err = validate();
    if (!err) {
        spinner();
        const newDoc = { type: "appointment", user: user, slot: slot, rsel: res };
        const options = { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(newDoc) };
        fetch('saveslot', options)
            .then(response => {
                if (response.ok) {
                    response.text()
                        .then(data => { get('divfinal').style.display = 'block'; spinner('stop'); })
                        .catch(err => console.log("Data: ", err));
                }
                else { spinner('stop'); toast("Could not save.. status code: " + response.statusText); }
            })
    }
    else toast(err);
}


//***********************************************************************
// TO be preloaded at server side
var SVC_RELOAD = true;
function loadServices() {
    if ((SVC_RELOAD) || (slot.bid != lstBus.value)) {
        slot.bid = lstBus.value; slot.bname = lstBus.options[lstBus.selectedIndex].text;
        if (slot.bid) {
            spinner();
            fetch('/services?mode=jsn&bid=' + slot.bid)
                .then(response => response.json()
                    .then(data => { loadSvcs(data); spinner('stop'); })
                    .catch(err => { log(err); spinner('stop') }))
                .catch(err => { log(err); spinner('stop') });
        }
    }
}

var services;
function loadSvcs(data) {
    services = data;
    const svcGrid = get('svcgrid'); svcGrid.innerHTML = "";
    const dvServices = create('div');
    services.forEach(element => {
        const alink = create('a');
        alink.setAttribute('class', 'a-settings');
        alink.setAttribute('id', element.sid);
        alink.href = "javascript:saveService('" + element.sid + "','" + element.sname + "')";
        alink.innerText = element.sname;
        dvServices.append(alink);
    });
    svcGrid.append(dvServices);
    SVC_RELOAD = false;
}



function showTimePicker() {
    get('dvTimePicker').style.display = 'grid';
    get('lblTime').innerText = "Select a time slot";
    drawTimeScale('dvTimeline', selDate, selDate);
}

function loadResources() {

}

var res = { tid: 'cr4yUEdrIlzG6qkoVLJb', rid: 'PnslCPxXYwzSIkRVPcZy' };
function clk_Resource(e, val) {
    res.start = slot.start; res.end = slot.end;
    e.style.background = 'var(--primary-color)';
    get('lblResources').innerText = val;
}

var currDiv = get('dvCustomer');
function setTab(dv, ic, open) {
    const icnStyle = get(ic).style;
    if (open) {
        if (currDiv) currDiv.style.display = 'none';
        currDiv = get(dv);
        currDiv.style.display = 'grid';
        if (ic) icnStyle.color == 'darkgray';
    }
    else {
        currDiv.style.display = 'block';
        if (ic) icnStyle.color == 'var(--primary-color)';
    }
}
function setIcnClr(icn) { i = get(icn); i.style.color = (VERIFIED) ? 'var(--primary-color)' : 'darkgray'; }
//***********************************************************************
get('iSearch').addEventListener('keyup', (e) => { if (e.keyCode == 13) searchCustomer() });
get('inpSearch').addEventListener('keyup', (e) => { if (e.keyCode == 13) searchCustomer() });
function log(val) { console.log(val); }