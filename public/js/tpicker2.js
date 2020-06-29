const selDuration = get('selDuration');
const divSlots = get('divSlots');
var pickedSlot;
function selSlot(e) {
    if (pickedSlot) pickedSlot.style.backgroundColor = 'white';
    pickedSlot = e;
    e.style.backgroundColor = 'var(--primary-color)'
    console.log(((e.getAttribute('data_t'))));
}
function newSlot(time) {
    const div = create('div');
    div.setAttribute('data_t', time.getTime()); //store time stamp
    div.setAttribute('onclick', 'selSlot(this)'); //store time stamp
    div.innerText = to12Hr(time);
    return div;
}
const tSlider = get('slider'); const lblDuration = get('lblDuration');

{/* < input type = "range" min = "0" max = "120" value = "30" id = "slider" step = "15" list = "volsettings" >
    <datalist id="volsettings">
        <option>0</option>
        <option>15</option>
        <option>30</option>
        <option>45</option>
        <option>60</option>
        <option>75</option>
        <option>90</option>
        <option>105</option>
        <option>120</option>
    </datalist>
    <label id="lblDuration">30 mins</label> */}

tSlider.addEventListener('change', (ev) => {
    lblDuration.innerText = tSlider.value + " mins";
})
function setDuration(div, d) {
    tp_time_scale_min = d;
    for (i = 1; i <= 6; i++)style(get('div' + i)).borderBottom = (div >= i) ? "3px solid var(--primary-color)" : "3px solid white";
    drawSlots();
}
setDuration(1, tp_time_scale_min);
    // < label for= "fader" hidden > Duration & Start time</label >
    //     <div class="slider" style="grid-template-columns:1fr 1fr 1fr 1fr 1fr 1fr ;">
    //         <div id="div1" onclick="setDuration(1,15)">15</div>
    //         <div id="div2" onclick="setDuration(2,30)">30</div>
    //         <div id="div3" onclick="setDuration(3,45)">45</div>
    //         <div id="div4" onclick="setDuration(4,60)">1 hr</div>
    //         <div id="div5" onclick="setDuration(5,90)">1.5 hr</div>
    //         <div id="div6" onclick="setDuration(6,120)">2 hr</div>
    //     </div>
