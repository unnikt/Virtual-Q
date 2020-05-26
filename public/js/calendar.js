const green = "rgb(122, 190, 122)";
const amber = "rgb(240, 196, 51)";
const red = "rgb(255, 12, 12)";
const velv = "rgb(240, 51, 234)";
const blue = '#a0b0ea';
const defColor = '#efefef';
var selCell = null;

var today = new Date();
var currMonth = today.getMonth();
var currYear = today.getFullYear();
var currDate = today.getDate();

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];


//Parameters for fetchevents **********************************************************
const inputs = { entity: 'user', month: currMonth+1, year: currYear };
const params = {
    method: 'POST',
    headers: {
        'Accept': 'application/json'
    },
    body: JSON.stringify(inputs)
}

function showEvents(events,divEvents) {
    //when promise fullfilled - then (cal_JSON = > { mark busydays })
    if (events.length == 0) return;
    busydays = new Set(events.map(x => x.date));
    busydays.forEach(date => markBusy(date, velv));
    var evnt_lst = get(divEvents); evnt_lst.innerHTML = "";
    const today = new Date().getDate();
    var dayhdr = "";
    events.forEach(evnt => {
        if (evnt.date >= today) {
            if (dayhdr != evnt.date) {
                dayhdr = evnt.date;
                const lbl_dt = create('label'); lbl_dt.setAttribute('class', 'date-hdr'); lbl_dt.innerText = [dayhdr, inputs.month, inputs.year].join('-');
                evnt_lst.appendChild(lbl_dt);
            }
            evnt_lst.appendChild(newEvent(evnt));
        }
    });
}
//*********************************************************************************/


//previous next events~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// get('prev-m').addEventListener('click', changeMonthYear('mon', 'prev'));
// get('next-m').addEventListener('click', changeMonthYear('mon', 'next'));
// get('prev-y').addEventListener('click', changeMonthYear('year', 'prev'));
// get('next-y').addEventListener('click', changeMonthYear('year', 'next'));
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function changeMonthYear(month_year, prev_next) {
    if (month_year == 'mon') {
        if (prev_next === 'prev')
            (currMonth == 0) ? currMonth = 11 : currMonth--;
        else
            (currMonth == 11) ? currMonth = 0 : currMonth++;
    }
    else
        (prev_next === 'prev') ? currYear-- : currYear++;
    drawCalendar();
    inputs.month = currMonth+1; inputs.year = currYear;
}

function setCurrentDate(date) {
    const dt = new Date(date);
    currYear = dt.getFullYear();
    currMonth = dt.getMonth(); 
    currDate = dt.getDate();
}

function drawCalendar() {
    var cal = get('cal-dates'); cal.innerHTML = "";
    days.forEach(day => cal.appendChild(newDay(day))); 
    const fd = new Date(currYear, currMonth, 1).getDay(); //Note: month is 0 for Jan
    const maxDate = new Date(currYear, currMonth+1, 0).getDate(); //Note: Date(2020,1,0) gives 31st Jan 2020; month 1 == Feb
    for (i = 0; i < fd; i++) cal.appendChild(newDay(-1));
    for (i = 1; i <= maxDate; i++)cal.appendChild(newDay(i, true));
    get('month').innerText = months[currMonth]; get('year').innerText = currYear;
    setDate(currDate);
}
function newDay(val, clkable) {
    const nday = create('div');
    nday.setAttribute('class', 'cal-wday')
    // if (clkable) nday.addEventListener('click', dateClicked(val));
    if (val != -1) {
        nday.setAttribute('id', val);
        nday.innerText = val;
    }
    return nday;
}

function newEvent(params) {
    var div_event = create('div');
    div_event.setAttribute('class', 'bbdr pada-12');
    div_event.setAttribute('onClick', "window.location='checkin?aid=" + params.aid +"'");
    const lbl_start = create('label'); lbl_start.innerText = params.start;
    const lbl_bname = create('label'); lbl_bname.innerText = params.bname; lbl_bname.style.display = 'inline';
    const icn = create('i'); icn.innerText = 'more_vert'; icn.setAttribute('class', 'material-icons');icn.setAttribute('style','font-size:1em;float:right;')
    div_event.appendChild(lbl_start); div_event.appendChild(lbl_bname); div_event.appendChild(icn);
    return div_event;
}

function setDate(el) {
    if (selCell) setcolor(selCell, defColor);
    setcolor(el, blue);
    selCell = el;
    // if(typeof dateClicked==="function") dateClicked(el); // custom function to do further processing
}

function markBusy(el, clr) { get(el).style.borderLeft = '4px solid ' + clr }
function setcolor(el, clr) { get(el).style.background = clr }
function create(el) { return document.createElement(el) }
function get(el) { return document.getElementById(el) }
