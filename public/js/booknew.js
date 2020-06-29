var user = { fname: '', sname: '', email: '', phone: '', notify: '' }
event.bid = lstBus.value;

var SAVE_READY = false;
var msg;

function findResources() {
    const payload = { bid: 'JJwLFsdHlN13pa5PE6uJ', sid: 'JJwLFsdHlN13pa5PE6uJ', date: selDate };
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
        get('start').innerText = new Date(getParams('start')).toString().slice(0, 21);
        get('end').innerText = new Date(getParams('end')).toString().slice(0, 21);
        setTab(val);
    }
    else alert(msg);
}

var currDiv = get('divCustomer');
setTab('divCustomer', 'tab1');
function setTab(div, tab) {
    if (currDiv) currDiv.style.display = 'none';
    currDiv = get(div); currDiv.style.display = 'grid';
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
    event.start = new Date(selDate); event.end = new Date(selDate);
    var dt = new Date(ms_StartTime); event.start.setHours(dt.getHours(), dt.getMinutes()); event.start = event.start.getTime();
    dt = new Date(ms_EndTime); event.end.setHours(dt.getHours(), dt.getMinutes()); event.end = event.end.getTime();
    // event.end = Number(tpEndTimems);
    msg = "Start time is not selected"; if (event.start == "") { SAVE_READY = false; return }
    msg = "End time is not selected"; if (event.end == "") { SAVE_READY = false; return }
    msg = null; SAVE_READY = true;
}
var bCreateUser = true;
function searchCustomer(mode) {
    //Validate values - Mode = find / create; 
    const payload = { mode: mode, type: 'cus', field: '', value: '', fname: '', sname: '', phone: '', email: '' };
    if (mode == 'find') {
        payload.value = get('inpSearch').value;
        if (payload.value.length < 8) { toast("Please enter a valid email id or Phone number!"); return; }
        else payload.field = isNaN(payload.value) ? 'email' : 'phone';
    }
    else if (mode == 'create') {
        if (!bCreateUser) { getServices('divServices'); return; }
        const email = get('email').value; if (email.length < 8) { toast("Please enter a valid email id!"); return; }
        const phone = get('phone').value; if (phone.length < 8) { toast("Please enter a valid phone!"); return; }
        payload.phone = phone; payload.email = email; payload.fname = get('fname'); payload.sname = get('sname');
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
    validate();
    if (SAVE_READY) {
        spinner();
        fetch('/saveslot', options)
            .then(response => response.text()
                .then(data => { showfinal(); spinner('stop'); })
                .catch(err => console.log("Data: ", err)))
            .catch(err => setTab('divfinal'));
    }
    else alert(msg);
}
function showCal() {
    get('dvTimePicker').style.display = 'none';
    setTab('divCalendar', 'tab3')
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
        setParams('bid', lstBus.value);
        if (event.bid) {
            spinner();
            fetch('/services?mode=jsn&bid=' + event.bid)
                .then(response => response.json()
                    .then(data => { loadSvcs(data); spinner('stop'); })
                    .catch(err => { log(err); spinner('stop') }))
                .catch(err => { log(err); spinner('stop') });
        }
    }
    get('lblCustomer').innerText = [get('fname').value, get('sname').value].join(' ');
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
    if (selSvc) selSvc.background = 'var(--secondary-color)';
    selSvc = get(sid).style;
    selSvc.background = 'var(--primary-color)';
    get('lblService').innerText = sname;
}

function showTimePicker() {
    get('lblDate').innerText = get('date').innerText;
    get('divCalendar').style.display = 'none';
    get('dvTimePicker').style.display = 'grid';
    addRes(1593306000000, 180, 'JAZ', 2);
    addRes(1593225000000, 120, 'PBS', 3);
    addRes(1593142200000, 30, 'WKM', 4);
    addRes(1593230400000, 30, 'JKL', 5);
}
//***********************************************************************
get('iSearch').addEventListener('keyup', (e) => { if (e.keyCode == 13) searchCustomer() });
get('inpSearch').addEventListener('keyup', (e) => { if (e.keyCode == 13) searchCustomer() });