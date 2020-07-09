var rmap = [
    { sid: '4566', rid: '1', rname: 'Res1', required: true },
    { sid: '4566', rid: '2', rname: 'Res2', required: true },
    { sid: '4566', rid: '3', rname: 'Res3', required: true },
    { sid: '', rid: '4', rname: 'Res4', required: true },
    { sid: '', rid: '5', rname: 'Res5', required: true },
    { sid: '', rid: '6', rname: 'Res6', required: true }
]

const loadResources = async () => {
    const response = await fetch('resMap?bid=' + bid);
    const rmap = await response.json();
}

const lstSvcs = get('lstSvcs');
lstSvcs.addEventListener('change', () => {
    if (lstSvcs.value) {
        fetchEvents('dvEvents', 'sid', lstSvcs.value);
        get('divEvnts-container').hidden = false;
    }
    else get('divEvnts-container').hidden = true;
});

var actvTab = get('tab1');
var actvDiv = get('dvNewService');
const dvServices = get('dvServices');
setTab(actvTab, 'dvViewServices');
function setTab(el, dv) {
    if (actvTab) actvTab.style.border = "none"; actvTab = el;
    el.style.borderBottom = "2px solid var(--secondary-color)";
    actvDiv.hidden = true; actvDiv = get(dv); actvDiv.hidden = false;
    dvServices.hidden = (dv === 'dvNewService') ? true : false;
}

const dvNewType = get('dvNewService').style;
get('icnNewSvc').addEventListener('click', (e) => {
    dvNewType.display = (dvNewType.display == 'block') ? 'none' : 'block';
    get('icnNewSvc').innerText = (dvNewType.display == 'block') ? 'close' : 'add';
})

const lstSvcs2 = get('lstSvcs2');
const lstAttached = get('lstAttached');
const lstUnAttached = get('lstUnAttached');
lstSvcs2.addEventListener('change', () => {
    lstAttached.innerText = lstUnAttached.innerText = "";
    if (lstSvcs2.value) rmap.forEach(rec => {
        const dvContainer = create('div'); dvContainer.setAttribute('id', rec.rid);
        const icnPin = create('i'); icnPin.setAttribute('class', 'material-icons')
        const icnAddRem = create('i');
        icnAddRem.setAttribute('class', 'material-icons');
        icnAddRem.setAttribute('onclick', 'addremove(this)');
        const lblRname = create('label'); lblRname.innerText = rec.rname;
        dvContainer.appendChild(icnPin); dvContainer.appendChild(lblRname); dvContainer.appendChild(icnAddRem);
        if (rec.sid == lstSvcs2.value) {
            icnPin.innerText = "push_pin";
            icnAddRem.innerText = "delete";
            lstAttached.append(dvContainer);
        }
        else {
            icnPin.innerText = "";
            icnAddRem.innerText = "add";
            lstUnAttached.append(dvContainer);
        }
    })
})

function addremove(ele) {
    const parentDiv = ele.parentElement;
    const icnPin = parentDiv.childNodes[0];
    const lblRname = parentDiv.childNodes[1];
    if (ele.innerText === 'add') {
        ele.innerText = 'delete';
        icnPin.innerText = 'push_pin';
        lstAttached.append(parentDiv);
        rmap.push({ sid: lstSvcs2.value, rid: parentDiv.id, rname: lblRname.innerText, required: true })
        lblRname.id = rmap.length - 1;
    }
    else {
        ele.innerText = 'add';
        icnPin.innerText = '';
        lstUnAttached.append(parentDiv);
        const idx = rmap.findIndex(item =>{return ((item.sid==lstSvcs2.value)&&(item.rid==parentDiv.id))})
        rmap.splice(idx, 1);
    }
}