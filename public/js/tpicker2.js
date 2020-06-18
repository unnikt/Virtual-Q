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
