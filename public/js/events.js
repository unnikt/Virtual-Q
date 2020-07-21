const payload = { id: '', val: '', month: '5', year: '2020' };
const params = { method: 'POST', headers: { 'Accept': 'application/json' }, body: '' }
const thisD = new Date().getDate();
var dvEvents = null;
var mode = 'uid'

function fetchEvents(divEvents, id, val) {
    dvEvents = get(divEvents);
    spinner();
    mode = id;
    payload.id = id; payload.val = val;
    params.body = JSON.stringify(payload);
    fetch("getevents", params)
        .then(response => response.json()
            .then(data => { showEvents(data.events); spinner('stop'); })
            .catch(err => console.log(err)))
        .catch(err => console.log(err));
}
var mEvents;
function showEvents(events) {
    if (events) {
        mEvents = events; dvEvents.innerHTML = "";
        var dayhdr = "";
        mEvents.forEach(e => {
            const d = ts2Date(e.start).getDate();
            const dStr = ts2Date(e.start).toDateString();
            if (d >= thisD) {
                if (dayhdr != dStr) {
                    dayhdr = dStr;
                    const lbl_dt = create('label'); lbl_dt.setAttribute('class', 'date-hdr'); lbl_dt.innerText = dayhdr;
                    dvEvents.appendChild(lbl_dt);
                }
                dvEvents.appendChild(newEvent(e));
            }
        });
    }
}
function newEvent(event) {
    var div_event = create('div');
    div_event.setAttribute('class', 'event');
    div_event.addEventListener('click', () => {
        const frmEl = get('frmcheckin').elements;
        frmEl['aid'].value = event.aid;
        frmEl['bname'].value = event.bname;
        frmEl['sname'].value = event.sname;
        frmEl['start'].value = [ts2Date(event.start).toDateString(), ts2Date(event.start).toLocaleTimeString()].join(' ');
        frmEl['end'].value = [ts2Date(event.end).toDateString(), ts2Date(event.end).toLocaleTimeString()].join(' ');
        get('frmcheckin').submit();
    })
    const lbl_start = create('label'); lbl_start.innerText = ts2LocalTime(event.start);
    const lbl_bname = create('label'); lbl_bname.innerText = (mode === 'uid') ? event.bname : event.uname;
    const lbl_svc = create('label'); lbl_svc.innerText = event.sname;
    const lbl_status = create('label'); lbl_status.innerText = event.status;
    div_event.appendChild(lbl_start); div_event.appendChild(lbl_bname);
    div_event.appendChild(lbl_status); div_event.appendChild(lbl_svc);
    return div_event;
}

function ts2LocalTime(ts) { return ts2Date(ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) }
function ts2Date(ts) { return new Date(ts._seconds * 1000); }
function create(el) { return document.createElement(el) }
function get(el) { return document.getElementById(el); }

