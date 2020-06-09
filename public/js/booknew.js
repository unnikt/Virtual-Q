var event = { bid: '', bname: '', uid: '', sid: '', svc: '', start: '', end: '' };
var user = { fname: '', sname: '', email: '', phone: '', notify: '' }
event.bid = lstBus.value;

var SAVE_READY = false;
var msg;

function setNotify() {
    var email = ""; var phone = "";
    if (get('notem').checked == true) email = 'email';
    if (get('nottel').checked == true) phone = 'phone';
    user.notify = [email, phone].join('|');
    if (user.notify.length > 1) get('submit').disabled = false;
    else get('submit').disabled = true;
}
function setParams(field, val) {
    switch (field) {
        case 'bid': case 'bname': case 'sid': case 'svc': case 'uid': case 'start': case 'end': event[field] = val; break;
        case 'fname': case 'sname': case 'phone': case 'email': case 'notify': user[field] = val; break;
    }
}
function getParams(field) {
    switch (field) {
        case 'bid': case 'sid': case 'uid': case 'start': case 'end': return event[field]; break;
        case 'fname': case 'sname': case 'phone': case 'email': case 'notify': return user[field]; break;
    }
}

function showReview(val) {
    validate();
    if (SAVE_READY) {
        get('name').innerText = [getParams('fname'), getParams('sname')].join(' ');
        get('mail').innerText = getParams('email');
        get('tel').innerText = getParams('phone');
        get('svc').innerText = get(getParams('sid')).innerText;
        get('start').innerText = getParams('start').toDateString();
        get('end').innerText = getParams('end').toDateString();
        setTab(val);
    }
    else alert(msg);
}

var currDiv = get('divCustomer');
function setTab(div, tab) {
    if (currDiv) currDiv.hidden = true;
    currDiv = get(div); currDiv.hidden = false;
}

function validate() {
    setParams('bid', lstBus.value); setParams('bname', lstBus.options[lstBus.selectedIndex].text);
    setParams('fname', get('fname').value);
    msg = "First name is required"; if (user.fname == "") { SAVE_READY = false; return }
    setParams('sname', get('sname').value);
    msg = "Sur name is required"; if (user.sname == "") { SAVE_READY = false; return }
    setParams('email', get('email').value);
    msg = "Email required"; if (user.email == "") { SAVE_READY = false; return }
    setParams('phone', get('phone').value);
    msg = "Phone number is required"; if (user.phone == "") { SAVE_READY = false; return }

    msg = "No Service selected"; if (event.sid == "") { SAVE_READY = false; return }
    // msg = "No Service selected"; if (event.sname == "") { SAVE_READY = false; return }
    msg = "Start time is not selected"; if (event.start == "") { SAVE_READY = false; return }
    msg = "End time is not selected"; if (event.end == "") { SAVE_READY = false; return }
    msg = null; SAVE_READY = true;
}
var bCreateUser = true;
function searchCustomer(mode) {
    //Validate values
    const payload = {
        mode: mode, type: 'cus', field: '', value: '',
        fname: '', sname: '', phone: '', email: ''
    };
    console.log(mode,bCreateUser); 
    if (mode == 'find') {
        const srchText = get('inpSearch').value;
        if (srchText.length < 8) { toast("Please enter a valid email id or Phone number!"); return; }
        else {
            payload.field = isNaN(srchText) ? 'email' : 'phone';
            payload.value = srchText;
        }
    }
    else if (mode == 'create') {
        if (!bCreateUser) { getServices('divServices'); return; }
        const email = get('email').value; if (email.length < 8) { toast("Please enter a valid email id!"); return; }
        const phone = get('phone').value; if (phone.length < 8) { toast("Please enter a valid phone!"); return; }
        payload.phone = phone; payload.email = email;
        payload.fname = get('fname'); payload.sname = get('sname');
    }
    const params = { method: 'POST', headers: { 'Accept': 'application/json' }, body: JSON.stringify(payload) };
    spinner();
    fetch('/finduser', params)
        .then(response => response.json()
            .then(data => {
                if (mode == 'find') showResults(data.results)
                else if (mode == 'create') { (data.code == 1) ? getServices('divServices') : toast(data.msg); bCreateUser = true; }
            })
            .catch(err => console.log(err)))
        .catch(err => console.log(err))
    spinner('stop');
}
function showResults(results) {
    if (results.length == 0) return;
    const divsrchResult = get('srchResult'); divsrchResult.innerHTML = "";
    get('selCustomer').style.display = 'block';
    results.forEach(cust => {
        const newdiv = create('a');
        newdiv.innerText = [cust.fname, cust.sname].join(' ');
        newdiv.addEventListener('click', e => {
            setParams('fname', cust.fname); get('fname').value = cust.fname;
            setParams('sname', cust.sname); get('sname').value = cust.sname;
            setParams('email', cust.email); get('email').value = cust.email;
            setParams('phone', cust.phone); get('phone').value = cust.phone;
            setParams('uid', cust.uid);
            get('selCustomer').style.display = 'none';
            bCreateUser = false;
        });
        divsrchResult.appendChild(newdiv);
    });
}
function saveBooking() {
    const newDoc = { type: "appointment", user: user, event: event };
    const options = { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(newDoc) };
    spinner();
    fetch('/saveslot', options)
        .then(response => response.text()
            .then(data => { get('tabs').style.display = 'none'; showfinal(); spinner('stop'); })
            .catch(err => console.log("Data: ", err)))
        .catch(err => { get('tabs').style.display = 'none'; setTab('divfinal') });

}

function showfinal() {
    const divfinal = get('divfinal').style;
    divfinal.display = 'block';
}

//***********************************************************************
var SVC_RELOAD = true;
function log(val) { console.log(val); }
function getServices(div, tab) {
    if ((SVC_RELOAD) || (event.bid != lstBus.value)) {
        spinner(); setParams('bid', lstBus.value);
        fetch('/services?mode=jsn&bid=' + event.bid)
            .then(response => response.json()
                .then(data => { loadSvcs(data); spinner('stop'); })
                .catch(err => { log(err); spinner('stop') }))
            .catch(err => { log(err); spinner('stop') })
    }
    setTab(div);
}

var services;
function loadSvcs(data) {
    services = data;
    const svcGrid = get('svcgrid');
    svcGrid.innerHTML = "";
    services.forEach(element => {
        const alink = create('a');
        alink.setAttribute('class', 'a-settings');
        alink.setAttribute('id', element.sid);
        alink.href = "javascript:saveService('" + element.sid + "','" + element.sname + "')";
        alink.innerText = element.sname;
        svcGrid.append(alink);
    });
    const btnnext = create('button');
    btnnext.innerText = 'Next';
    btnnext.addEventListener('click', (e) => setTab('divCalendar'));
    svcGrid.append(btnnext);
    SVC_RELOAD = false;
}

var selSvc = null;
function saveService(sid, sname) {
    setParams('sid', sid); setParams('svc', sname);
    if (selSvc) selSvc.style.background = 'var(--secondary-color)';
    selSvc = get(sid);
    selSvc.style.background = 'var(--primary-color)';
}
//***********************************************************************
