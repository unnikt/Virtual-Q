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

var selCell = null;
var selDate = null;

var currMonth = today.getMonth();
var currYear = today.getFullYear();
var currDate = today.getDate();

//Parameters for fetchevents **********************************************************
const inputs = { id:'',val:'', month: currMonth, year: currYear };
const params = {
    method: 'POST',
    headers: {'Accept': 'application/json'},
    body: JSON.stringify(inputs)
}
var mEvents; 
function showEvents(events, divEvents) {
    if (events.length == 0) return;
    mEvents = events; markBusyDays();
    var evnt_lst = get(divEvents); evnt_lst.innerHTML = "";
    var dayhdr = "";
    mEvents.forEach(evnt => {
        const d = ts2Date(evnt.start).getDate();
        const dStr = ts2Date(evnt.start).toDateString();
        if (d >= thisD) {
            if (dayhdr != dStr) {
                dayhdr = dStr;
                const lbl_dt = create('label'); lbl_dt.setAttribute('class', 'date-hdr'); lbl_dt.innerText = dayhdr;
                evnt_lst.appendChild(lbl_dt);
            }
            evnt_lst.appendChild(newEvent(evnt));
        }
    });
}
function newEvent(event) {
    var div_event = create('div');
    div_event.setAttribute('class', 'event');
    div_event.addEventListener('click', ev => {
        const frmEl = get('frmcheckin').elements;
        frmEl['aid'].value = event.aid;
        frmEl['bname'].value = event.bname;
        frmEl['sname'].value = event.sname;
        frmEl['start'].value = [ts2Date(event.start).toDateString(), ts2Date(event.start).toLocaleTimeString()].join(' ');
        frmEl['end'].value = [ts2Date(event.end).toDateString(), ts2Date(event.end).toLocaleTimeString()].join(' ');
        get('frmcheckin').submit();
    })
    const lbl_start = create('label'); lbl_start.innerText = ts2LocalTime(event.start);
    const lbl_bname = create('label'); lbl_bname.innerText = event.bname; lbl_bname.style.display = 'inline';
    const icn = create('i'); icn.innerText = 'more_vert'; icn.setAttribute('class', 'material-icons'); icn.setAttribute('style', 'font-size:1em;float:right;')
    div_event.appendChild(lbl_start); div_event.appendChild(lbl_bname); div_event.appendChild(icn);
    return div_event;
}
//*********************************************************************************/

var prevDate = "";
function setDateClicks() {
    for (i = 7; i < calDates.length; i++) {
        const date = calDates[i].innerText;
        if (date != "")
            if ((currYear<=thisY)&&(currMonth<=thisM)&&(date <thisD))
                {setColor(date, grey);}
            else
                get(date).addEventListener('click', (e) => {
                    selDate = new Date([currYear, currMonth + 1, date].join('-'));
                    //TODO to be removed........................................
                    var d = new Date();
                    selDate.setHours(d.getHours());
                    selDate.setMinutes(d.getMinutes());
                    //...........................................................
                    setParams('start', selDate); setParams('end', selDate);
                    if (prevDate != "") setColor(prevDate, "var(--light-background)");
                    setColor(date, blue);
                    prevDate = date;
                })
    }
}

function changeMonthYear(month_year, prev_next) {
    if (month_year == 'mon') {
        if (prev_next === 'prev') currMonth = (currMonth === 0) ? 11 : --currMonth;
        if (prev_next === 'next') currMonth = (currMonth === 11) ? 0 : ++currMonth;
    }
    else
        (prev_next === 'prev') ? currYear-- : currYear++;
    drawCalendar();
    inputs.month = currMonth; inputs.year = currYear;
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
    if (val != -1) {nday.setAttribute('id', val);nday.innerText = val;}
    return nday;
}

function markBusyDays() {
    busydays = new Set(mEvents.map(e => ts2Date(e.start).getDate()));
    busydays.forEach(date => get(date).style.borderLeft = '2px solid ' + velv)
}

function setDate(el) { if (selCell) setColor(selCell, defColor); setColor(el, blue); selCell = el; }
function setColor(el, clr) { get(el).style.background = clr }
function ts2Date(ts) { return new Date(ts._seconds * 1000); }
function ts2LocalTime(ts) {return ts2Date(ts).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
