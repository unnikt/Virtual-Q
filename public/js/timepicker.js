var event = { bid: '', bname: '', uid: '', sid: '', svc: '', start: '', end: '' };

var dvTimeline;
const HIGHLIGHT = "var(--primary-color)"
const LOWLIGHT = "var(--light-background)"
const millSecond = 60000;

var dt_DayOpen = new Date();
var dt_DayClose = new Date();
var min_TimeScale = 30;
var ms_StartTime = null;
var ms_EndTime = null;

dt_DayOpen.setHours(9, 30, 0, 0);
dt_DayClose.setHours(17, 30, 0, 0);

function to12Hr(t) {
    const hh = t.getHours(); const mm = lpad0(t.getMinutes());
    return (hh > 12) ? ([(hh - 12), ':', mm, ' PM'].join('')) : ([hh, ':', mm, ' AM'].join(''));
}
function lpad0(mm) { return (mm < 10) ? '0' + mm : mm; }
function incrTime(date, mins) { return new Date(date.getTime() + mins * 60000); }
function incrTime_ms(ms, mins) { return new Date(ms + mins * 60000); }
function style(e) { return e.style }
function get(e) { return document.getElementById(e) }
function create(e) { return document.createElement(e) }
function setGridArea(el, row, col) { el.style.gridArea = [row, col].join('/') }


function newTime(time, row, css) {
    const div = create('div');
    div.setAttribute('id', time.getTime()); //store time stamp
    div.setAttribute('class', css); //set the class as 
    div.setAttribute('data-row', row); //store the row number for later use
    div.innerText = to12Hr(time);
    return div;
}

var arrSlots = [];
function selRes(e) {
    let style = e.style;
    const res = e.getAttribute('data-res');
    const selTime = Number(e.getAttribute('data-time'));
    const resCol = e.getAttribute('id').split('-')[2];
    paintSlots(res, resCol, '0.1');
    addtoBasket(res, selTime);
    paintSlots(res, resCol, '1');
    refreshBasket(res);
}

function paintSlots(res, resCol, opacity) {
    const idx = arrSlots.indexOf(res);
    if (idx != -1) {
        let startRow = Number(get(arrSlots[idx + 1]).getAttribute('data-row'));
        let endRow = Number(get(arrSlots[idx + 2]).getAttribute('data-row'));
        for (i = startRow; i < endRow; i++) {
            var resID = [res, i, resCol].join('-');
            get(resID).style.opacity = opacity;
        }
    }
}
function addtoBasket(res, tm) {
    const idx = arrSlots.indexOf(res); const sI = idx + 1; const eI = idx + 2;
    const end = incrTime_ms(tm, min_TimeScale).getTime();
    if (idx == -1) arrSlots.push(res, tm, end);
    else {
        if (arrSlots[sI] == tm) { (arrSlots[eI] == end) ? arrSlots.splice(idx, 3) : arrSlots[sI] = end; }
        else if (arrSlots[eI] == end) arrSlots[eI] = tm;
        else if (tm < arrSlots[sI]) arrSlots[sI] = tm;
        else if (tm > arrSlots[eI]) arrSlots[eI] = end;
        else if ((tm - arrSlots[sI]) < (arrSlots[eI] - tm)) arrSlots[sI] = tm;
        else arrSlots[eI] = end;
    }
}
const divRes = get('divRes');
function refreshBasket(res) {
    const idx = arrSlots.indexOf(res);
    var divr = get(res);
    if ((idx == -1) && (divr)) divRes.removeChild(divr);
    else {
        let start = to12Hr(new Date(Number(arrSlots[idx + 1])));
        let end = to12Hr(new Date(Number(arrSlots[idx + 2])));
        if (!divr) {
            divr = create('div');
            divr.setAttribute('id', res);
            divRes.appendChild(divr);
        }
        divr.innerText = [res, start, '-', end].join(' ');
    }
}

function setHeader(title, dvcol) {
    const dvHeader = create('div'); dvHeader.innerText = title; setGridArea(dvHeader, 1, dvcol);
    dvHeader.setAttribute('class', 'timeHeader')
    dvTimeline.appendChild(dvHeader);
}
function addRes(start, duration, res, dvcol) {
    var dvStart = get(start);
    if (dvStart) {
        var t = new Date(start); const end = incrTime(t, duration);
        setHeader(res, dvcol);
        while (t <= end) {
            var dvrow = dvStart.getAttribute('data-row');
            var newDiv = create('div');
            newDiv.setAttribute('id', [res, dvrow, dvcol].join('-'));
            newDiv.setAttribute('class', 'avlbl');
            newDiv.setAttribute('data-res', res);
            newDiv.setAttribute('data-time', t.getTime());
            newDiv.setAttribute('onclick', 'selRes(this)');
            setGridArea(newDiv, dvrow, dvcol);
            dvTimeline.appendChild(newDiv);
            t = incrTime(t, min_TimeScale);
            dvStart = get(t.getTime());
        }
    }
}

function drawTimeScale(divTarget, Open, Close) {
    dt_DayOpen = (Open) ? Open : new Date();
    dt_DayClose = (Close) ? Close : new Date();
    //**TODO Remove this code once the Open and Close times are set */
    dt_DayOpen.setHours(9, 30, 0, 0);
    dt_DayClose.setHours(17, 30, 0, 0);
    //**Remove Hard code */

    dvTimeline = get(divTarget);
    var t = dt_DayOpen; dvTimeline.innerHTML = ""; ms_StartTime = null;
    setHeader('Start', 1);
    var r = 1;
    while (t < dt_DayClose) { r++; dvTimeline.append(newTime(t, r, 'time')); t = incrTime(t, min_TimeScale); }
}

