const green = "rgb(122, 190, 122)";
const amber = "rgb(240, 196, 51)";
const red = "rgb(255, 12, 12)";
const velv = "rgb(240, 51, 234)";
var today = new Date();
var selMonth = today.getMonth();
var selYear = today.getFullYear();
var selDate = today.getDate();

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

drawCalendar();

// setcolor('31', red);
//previous next events~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
get('month').innerText = months[selMonth]; get('year').innerText = selYear;
get('prev-m').addEventListener('click', (ev) => { get('month').innerText = months[(selMonth == 0) ? selMonth = 11 : --selMonth]; drawCalendar();})
get('next-m').addEventListener('click', (ev) => { get('month').innerText = months[(selMonth == 11) ? selMonth = 0 : ++selMonth]; drawCalendar();})
get('prev-y').addEventListener('click', (ev) => { get('year').innerText = --selYear; drawCalendar();})
get('next-y').addEventListener('click', (ev) => { get('year').innerText = ++selYear; drawCalendar();})
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function drawCalendar() {
    var cal = get('cal-dates'); cal.innerHTML = "";
    days.forEach(day => cal.appendChild(newDay(day)))
    const fd = firstday(selMonth, selYear); const dim = new Date(selYear, selMonth+1, 0).getDate();
    for (i = 0; i < fd; i++) cal.appendChild(newDay(-1));
    for (i = 1; i <= dim; i++)cal.appendChild(newDay(i, true));
}
function newDay(val, clkable) {
    const nday = create('div');
    nday.setAttribute('class', 'cal-wday')
    if (clkable) nday.addEventListener('click', (e) => selthis(e.target.id))
    if (val != -1) {
        nday.setAttribute('id', val);
        nday.innerText = val;
    }
    return nday;
}

var selCell = null;
var defColor = '#efefef';
var selColor = '#a0b0ea';
function selthis(el) {
    if (selCell) setcolor(selCell, defColor);
    setcolor(el, selColor);
    selCell = el;
    if(typeof dateClicked==="function") dateClicked(el); // custom function to do further processing
}

function firstday(m, y) { return (new Date(y, m, 1).getDay()) }
function setborder(el, clr) { get(el).style.borderLeft = '4px solid ' + clr }
function setcolor(el, clr) { get(el).style.background = clr }
function create(el) { return document.createElement(el) }
function get(el) { return document.getElementById(el) }
