class TimePicker {
    HIGHLIGHT = "var(--primary-color)"
    LOWLIGHT = "var(--light-background)"
    millSecond = 60000;
    tpTimeScaleMins = 30;

    constructor() {

    }

    attach(div) {
        this.dvTimeline = get(div);
    }
    /**
     * @param {number} time
     */
    set TimeScale(time) { min_TimeScale = time; }
    /**
     * @param {Date} time
     */
    set DayOpen(time) { dt_DayOpen = time; }
    /**
     * @param {Date} time
     */
    set DayClose(time) { dt_DayClose = time; }
    drawTimeScale() {
        dt_DayOpen = (event.start) ? event.start : new Date();
        dt_DayClose = (event.end) ? event.end : new Date();
        dt_DayOpen.setHours(9, 30, 0, 0);
        dt_DayClose.setHours(17, 30, 0, 0);
        var t = dt_DayOpen; dvTimeline.innerHTML = ""; ms_StartTime = null;
        setHeader('Start', 1);
        var r = 1;
        while (t < dt_DayClose) { r++; dvTimeline.append(newTime(t, r, 'time')); t = incrTime(t, min_TimeScale); }
    }
}

const x = new TimePicker(); 


var event = { bid: '', bname: '', uid: '', sid: '', svc: '', start: '', end: '' };


var dt_DayOpen = new Date();
var dt_DayClose = new Date();
var min_TimeScale = 30;
var ms_StartTime = null;
var ms_EndTime = null;

dt_DayOpen.setHours(9, 30, 0, 0);
dt_DayClose.setHours(17, 30, 0, 0);

function drawTimeScale() {
    dt_DayOpen = (event.start) ? event.start : new Date();
    dt_DayClose = (event.end) ? event.end : new Date();
    dt_DayOpen.setHours(9, 30, 0, 0);
    dt_DayClose.setHours(17, 30, 0, 0);
    var t = dt_DayOpen; dvTimeline.innerHTML = ""; ms_StartTime = null;
    setHeader('Start', 1);
    var r = 1;
    while (t < dt_DayClose) { r++; dvTimeline.append(newTime(t, r, 'time')); t = incrTime(t, min_TimeScale); }
}

function newTime(time, row, css) {
    const div = create('div');
    div.setAttribute('id', time.getTime()); //store time stamp
    div.setAttribute('class', css); //set the class as 
    div.setAttribute('data-row', row); //store the row number for later use
    // lbl.setAttribute('onclick', 'selSlot(this)');
    div.innerText = to12Hr(time);
    return div;
}

function gettm(t) { return new Date(t).toLocaleTimeString().slice(0, 5); }

function selSlot(e) {
    var prev_start = ms_StartTime;
    var prev_end = ms_EndTime;

    const tms = Number(e.getAttribute('data_t'));

    if (!ms_StartTime) ms_StartTime = ms_EndTime = tms;
    else if (!ms_EndTime) ms_EndTime = tms;
    else if (tms < ms_StartTime) ms_StartTime = tms
    else if (tms > ms_EndTime) ms_EndTime = tms;
    else if ((tms == ms_StartTime) && (ms_EndTime > tms)) ms_StartTime += 15 * millSecond;
    else if ((tms == ms_EndTime) && (ms_StartTime < tms)) ms_EndTime -= 15 * millSecond;
    else if ((tms - ms_StartTime) >= (ms_EndTime - tms)) ms_EndTime = tms;
    else ms_StartTime = tms;

    if (prev_start) tp_setColor(prev_start, ms_StartTime, LOWLIGHT);
    if (prev_end) tp_setColor(ms_EndTime, prev_end, LOWLIGHT);
    tp_setColor(ms_StartTime, ms_EndTime, HIGHLIGHT);

    get('lblStart').innerText = to12Hr(new Date(ms_StartTime));
    get('lblEnd').innerText = to12Hr(new Date(ms_EndTime));
}
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

const res1 = [[1592366372599, 30], [1592366372599, 45], [1592377557500, 60]];
function showAvail(e) {
    e.style.backgroundColor = "var(--primary-color)"
    res1.forEach(item => {
        const fc = getFloorCeiling(item[0], item[0] + item[1] * millSecond, min_TimeScale);
        var floor = fc.floor; const ceiling = fc.ceiling;
        while (floor < ceiling) {
            console.log(new Date(floor));
            const divt = get(floor);
            if (divt) { style(divt).backgroundColor = "lightgrey"; divt.removeAttribute("onclick"); }
            floor += (min_TimeScale * millSecond);
        }
    })
}

function clearTime() {
    if ((ms_StartTime) && (ms_EndTime)) { tp_setColor(ms_StartTime, ms_EndTime, LOWLIGHT); ms_StartTime = ms_EndTime = null; }
    get('lblStart').innerText = get('lblEnd').innerText = "--:-- AM";
}
function tp_setColor(ts, te, color) { while (ts <= te) { get(ts).style.backgroundColor = color; ts += 15 * millSecond; } }

function getFloorCeiling(start, end, scale) {
    const Scale_ms = scale * millSecond;
    var floor = Math.floor(start / Scale_ms) * Scale_ms;
    var ceiling = Math.floor(end / Scale_ms) * Scale_ms
    if (ceiling % Scale_ms > 0) ceiling += Scale_ms;
    return { floor: floor, ceiling: ceiling };
}

var arrSlots = [];
function selRes(e) {
    let style = e.style;
    const res = e.getAttribute('data-res');
    const selTime = Number(e.getAttribute('data-time'));
    const resCol = e.getAttribute('id').split('-')[2];
    paintSlots(res, resCol, '0.5');
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
            newDiv.setAttribute('class', 'resGrid');
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

