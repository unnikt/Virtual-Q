const green = "rgb(122, 190, 122)";
const amber = "rgb(240, 196, 51)";
const red = "rgb(255, 12, 12)";
const velv = "rgb(240, 51, 234)";
const blue = '#a0b0ea';
const grey = 'lightgrey';
const defColor = '#efefef';
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const today = new Date();
const thisM = today.getMonth(); const thisY = today.getFullYear(); const thisD = today.getDate();
var mode = 'cus'; //Options are 'bus','cus' and 'res'

var selCell = null;
var selDate = null;

var currMonth = today.getMonth();
var currYear = today.getFullYear();
var currDate = today.getDate();

//Parameters for fetchevents **********************************************************
const payload = { id: '', val: '', month: currMonth, year: currYear };
const params = { method: 'POST', headers: { 'Accept': 'application/json' }, body: JSON.stringify(payload) }

var mEvents;
function showEvents(events, divEvents) {
    if (events) {
        mEvents = events; markBusyDays();
        var evnt_lst = get(divEvents); evnt_lst.innerHTML = "";
        var dayhdr = "";
        mEvents.forEach(e => {
            const d = ts2Date(e.start).getDate();
            const dStr = ts2Date(e.start).toDateString();
            if (d >= thisD) {
                if (dayhdr != dStr) {
                    dayhdr = dStr;
                    const lbl_dt = create('label'); lbl_dt.setAttribute('class', 'date-hdr'); lbl_dt.innerText = dayhdr;
                    evnt_lst.appendChild(lbl_dt);
                }
                evnt_lst.appendChild(newEvent(e));
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
    const lbl_bname = create('label'); lbl_bname.innerText = (mode === 'cus') ? event.bname : event.uname;
    const lbl_svc = create('label'); lbl_svc.innerText = event.sname;
    const lbl_status = create('label'); lbl_status.innerText = event.status;
    div_event.appendChild(lbl_bname);div_event.appendChild(lbl_start);  div_event.appendChild(lbl_svc); div_event.appendChild(lbl_status);
    return div_event;
}
//*********************************************************************************/

var prevDate = "";
const calDates = get('cal-dates').children;
function setDateClicks() {
    for (i = 7; i < calDates.length; i++) {
        const dt = calDates[i].innerText;
        if (dt)
            if ((currYear <= thisY) && (currMonth <= thisM) && (dt < thisD)) { setColor(dt, grey); }
            else get(dt).addEventListener('click', () => clickDate(dt))
    }

}

function clickDate(date) {
    selDate = new Date([currYear, currMonth + 1, date].join('-'));
    setParams('start', selDate); setParams('end', selDate);
    if (prevDate != "") setColor(prevDate, "var(--light-background)");
    setColor(date, blue);
    get('date').innerText = [date, months[currMonth], currYear].join('-');
    prevDate = date;
}

function changeMonthYear(month_year, prev_next) {
    if (month_year == 'mon') {
        if (prev_next === 'prev') currMonth = (currMonth === 0) ? 11 : --currMonth;
        if (prev_next === 'next') currMonth = (currMonth === 11) ? 0 : ++currMonth;
    }
    else
        (prev_next === 'prev') ? currYear-- : currYear++;
    drawCalendar();
    payload.month = currMonth; payload.year = currYear;
}

function setCurrentDate(date) { const dt = new Date(date); currYear = dt.getFullYear(); currMonth = dt.getMonth(); currDate = dt.getDate(); }
function drawCalendar() {
    var cal = get('cal-dates'); cal.innerHTML = "";
    days.forEach(day => cal.appendChild(newDay(day)));
    const fd = new Date(currYear, currMonth, 1).getDay(); //Note: month is 0 for Jan
    const maxDate = new Date(currYear, currMonth + 1, 0).getDate(); //Note: Date(2020,1,0) gives 31st Jan 2020; month 1 == Feb
    for (i = 0; i < fd; i++) cal.appendChild(newDay(-1));
    for (i = 1; i <= maxDate; i++)cal.appendChild(newDay(i));
    get('month').innerText = months[currMonth]; get('year').innerText = currYear;
    if ((currMonth == thisM) && (currYear == thisY)) setDate(currDate);
}
function newDay(val) {
    const nday = create('div');
    nday.setAttribute('class', 'cal-wday')
    if (val != -1) { nday.setAttribute('id', val); nday.innerText = val; }
    return nday;
}

function markBusyDays() {
    busydays = new Set(mEvents.map(e => ts2Date(e.start).getDate()));
    busydays.forEach(date => get(date).style.borderBottom = '2px solid var(--secondary-color)');
}

function fetchEvents() {
    spinner();
    payload.id = (uid) ? 'uid' : (bid) ? 'bid' : (sid) ? 'sid' : null;
    payload.val = (uid) ? uid : (bid) ? bid : (sid) ? sid : null;
    mode = (uid) ? 'cus' : (bid) ? 'bus' : (sid) ? 'svc' : null;

    params.body = JSON.stringify(payload);
    fetch("/getevents", params)
        .then(response => response.json()
            .then(data => { showEvents(data.events, 'evnt-lst'); spinner('stop'); })
            .catch(err => console.log(err)))
        .catch(err => console.log(err));
}

function localCMY(mon_year, prev_next) { changeMonthYear(mon_year, prev_next); fetchEvents(); }
function setDate(date) { if (selCell) setColor(selCell, defColor); setColor(date, blue); selCell = date; selDate = new Date(currYear, currMonth, date); }
function setColor(el, clr) { get(el).style.background = clr }
function ts2Date(ts) { return new Date(ts._seconds * 1000); }
function ts2LocalTime(ts) { return ts2Date(ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) }

setCurrentDate([today.getFullYear(), today.getMonth() + 1, today.getDate()].join('-'));
drawCalendar(); setColor(currDate, blue);