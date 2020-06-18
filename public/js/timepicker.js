var tp_OpenTime = new Date();
var tp_CloseTime = new Date();
const tp_Timeline_Div = get('dvTimeline');
var tp_time_scale_min = 15; 
var tp_SelectedTime_ms = null;

tp_OpenTime.setHours(9, 30, 0, 0);
tp_CloseTime.setHours(17, 30, 0, 0);

function setDuration(div, d) {
    tp_time_scale_min = d;
    for (i = 1; i <= 6; i++)style(get('div' + i)).borderBottom = (div >= i) ? "3px solid var(--primary-color)" : "3px solid white";
    drawSlots();
}
setDuration(1, tp_time_scale_min);

function drawSlots() {
    var t = tp_OpenTime; tp_Timeline_Div.innerHTML = ""; tp_SelectedTime_ms = null;
    while (t < tp_CloseTime) {tp_Timeline_Div.append(newSlot(t));t = incrTime(t, tp_time_scale_min);}
}
function newSlot(time) {
    const div = create('div');
    div.setAttribute('id', time.getTime()); //store time stamp
    div.setAttribute('data_t', time.getTime()); //store time stamp
    div.setAttribute('onclick', 'selSlot(this)');
    div.innerText = to12Hr(time);
    return div;                                                                                                                             
}

function selSlot(e) {
    tp_SelectedTime_ms = e.getAttribute('data_t');
    console.log(tp_SelectedTime_ms, tp_time_scale_min);
}
function to12Hr(t) {
    const hh = t.getHours(); const mm = lpad0(t.getMinutes());
    return (hh > 12) ? ([(hh - 12), ':', mm, ' PM'].join('')) : ([hh, ':', mm, ' AM'].join(''));
}
function lpad0(mm) { return (mm < 10) ? '0' + mm : mm; }
function incrTime(t, mins) { return new Date(t.getTime() + mins * 60000); }
function style(e) { return e.style }
function get(e) { return document.getElementById(e) }
function create(e) { return document.createElement(e) }

const res1 = [[1592366372599, 30], [1592366372599, 45], [1592377557500, 60]];
function showAvail(e, res) {
    e.style.backgroundColor = "var(--primary-color)"
    res1.forEach(item => {
        const fc = getFloorCeiling(item[0], item[0] + item[1] * millSecond, tp_time_scale_min);
        var floor = fc.floor; const ceiling = fc.ceiling;
        while (floor < ceiling) {
            console.log(new Date(floor));
            const divt = get(floor);
            if (divt) { style(divt).backgroundColor = "lightgrey"; divt.removeAttribute("onclick"); }
            floor += (tp_time_scale_min * millSecond);
        }
        // console.log(new Date(fc.ceiling));
    })
}

const millSecond = 60000;
function getFloorCeiling(start, end, scale) {
    const Scale_ms = scale * millSecond;
    var floor = Math.floor(start / Scale_ms) * Scale_ms;
    var ceiling = Math.floor(end / Scale_ms) * Scale_ms
    if (ceiling % Scale_ms > 0) ceiling += Scale_ms;
    return { floor: floor, ceiling: ceiling };
}