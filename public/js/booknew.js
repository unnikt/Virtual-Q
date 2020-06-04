var event = { bid: '', uid: '', sid: '', start: '', end: '' };
var user = { fname: '', sname: '', email: '', phone: '', notify: '' }
event.bid = lstBus.value;
console.log(event.bid);

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
        case 'bid': case 'sid': case 'uid': case 'start': case 'end': event[field] = val; break;
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
    setParams('fname', get('fname').value);
    msg = "First name is required"; if (user.fname == "") { SAVE_READY = false; return }
    setParams('sname', get('sname').value);
    msg = "Sur name is required"; if (user.sname == "") { SAVE_READY = false; return }
    setParams('email', get('email').value);
    msg = "Email required"; if (user.email == "") { SAVE_READY = false; return }
    setParams('phone', get('phone').value);
    msg = "Phone number is required"; if (user.phone == "") { SAVE_READY = false; return }

    setParams('bid', lstBus.value);
    msg = "No Service selected"; if (event.sid == "") { SAVE_READY = false; return }
    msg = "No Service selected"; if (event.sname == "") { SAVE_READY = false; return }
    msg = "Start time is not selected"; if (event.start == "") { SAVE_READY = false; return }
    msg = "End time is not selected"; if (event.end == "") { SAVE_READY = false; return }
    msg = null; SAVE_READY = true;
}
function searchCustomer() {
    const srchText = get('inpSearch').value;
    if (srchText.length < 8) return;

    const inputs = { entity: 'users', field: 'phone', value: srchText };
    if (isNaN(srchText)) inputs.field = 'email';

    const params = { method: 'POST', headers: { 'Accept': 'application/json' }, body: JSON.stringify(inputs) };
    spinner();
    fetch('/finduser', params)
        .then(response => response.json()
            .then(data => { showResults(data.results); spinner('stop'); })
            .catch(err => console.log(err)))
        .catch(err => console.log(err))
}
function showResults(results) {
    if (results.length == 0) return;
    const divsrchResult = get('srchResult'); divsrchResult.innerHTML = "";
    get('selCustomer').style.display = 'block';
    results.forEach(cust => {
        const newdiv = create('a');
        newdiv.innerText = [cust.fname, cust.sname].join(' ');
        // newdiv.setAttribute('class', 'results')
        newdiv.addEventListener('click', e => {
            setParams('fname', cust.fname); get('fname').value = cust.fname;
            setParams('sname', cust.sname); get('sname').value = cust.sname;
            setParams('email', cust.email); get('email').value = cust.email;
            setParams('phone', cust.phone); get('phone').value = cust.phone;
            setParams('uid', cust.uid);
            get('selCustomer').style.display = 'none';
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
            .then(data => { get('tabs').style.display = 'none'; setTab('divfinal'); spinner('stop'); })
            .catch(err => console.log("Data: ", err)))
        .catch(err => { get('tabs').style.display = 'none'; setTab('divfinal') });

}

//***********************************************************************
var SVC_RELOAD = true;
function log(val) { console.log(val);}
function getServices(div, tab) {
    if ((SVC_RELOAD) || (event.bid != lstBus.value)) {
        spinner(); setParams('bid', lstBus.value);
        fetch('/services?mode=jsn&pid=' + event.bid)
            .then(response => response.json()
                .then(data => { loadSvcs(data); spinner('stop'); })
                .catch(err => { log(err);spinner('stop')}))
            .catch(err => { log(err); spinner('stop')})
    }
    setTab(div);
}
function loadSvcs(data) {
    const svcGrid = get('svcgrid');
    svcGrid.innerHTML = "";
    data.forEach(element => {
        const alink = create('a');
        alink.setAttribute('class', 'a-settings');
        alink.setAttribute('id', element.sid);
        alink.href = "javascript:saveService('sid','" + element.sid + "')";
        alink.innerText = element.sname;
        svcGrid.append(alink);
    });
    const btnnext = create('button');
    btnnext.innerText = 'Next';
    btnnext.addEventListener('click', (e)=> setTab('divCalendar'));
    svcGrid.append(btnnext);
    SVC_RELOAD = false;
}

function saveService(field, val) {
    if (val === getParams(field)) {
        setParams(field, "");
        get(val).style.background = 'var(--secondary-color)';
    }
    else {
        setParams(field, val);
        get(val).style.background = 'var(--primary-color)';
    }
}
//***********************************************************************
