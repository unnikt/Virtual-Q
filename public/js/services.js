var reslst = [];
//TO DO - Remove hard coding
// var reslst = [{ "sid": "", "required": false, "tid": "1NFRrWdV79Iv3HwD5W5K", "rtype": "Aircraft" }, { "sid": "", "required": false, "tid": "cr4yUEdrIlzG6qkoVLJb", "rtype": "Instructor(CFI)" }];

var rmap = [];

const loadResources = async () => {
    const response = await fetch('getresmap?bid=' + bid);
    rmap = await response.json();
    reslst = rmap.filter(itm => itm.sid == "");
    rmap = rmap.filter(itm => itm.sid != "")
}
loadResources();

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
    if (lstSvcs2.value) {
        const tmpAttached = rmap.filter(itm => (itm.sid == lstSvcs2.value));
        var tmpUnattached = reslst;
        tmpAttached.forEach(rec => {
            lstAttached.append(getResContainer(rec.tid, rec.rtype, 'push_pin', 'delete'));
            tmpUnattached = tmpUnattached.filter(itm => (itm.tid != rec.tid));
        })
        tmpUnattached.forEach(rec => {
            lstUnAttached.append(getResContainer(rec.tid, rec.rtype, '', 'add'));
        })
    }
})

function getResContainer(tid, rtype, txtPin, txtAddRem) {
    const dvContainer = create('div'); dvContainer.setAttribute('id', tid);
    const icnPin = create('i'); icnPin.setAttribute('class', 'material-icons'); icnPin.innerText = txtPin;
    const icnAddRem = create('i');
    icnAddRem.setAttribute('class', 'material-icons'); icnAddRem.innerText = txtAddRem;
    icnAddRem.setAttribute('onclick', 'addremove(this)');
    const lblRname = create('label'); lblRname.innerText = rtype;
    dvContainer.appendChild(icnPin); dvContainer.appendChild(lblRname); dvContainer.appendChild(icnAddRem);
    return (dvContainer);
}

function addremove(ele) {
    const parentDiv = ele.parentElement;
    const icnPin = parentDiv.childNodes[0];
    const lblRname = parentDiv.childNodes[1];
    if (ele.innerText === 'add') {
        ele.innerText = 'delete';
        icnPin.innerText = 'push_pin';
        lstAttached.append(parentDiv);
        rmap.push({ sid: lstSvcs2.value, tid: parentDiv.id, rtype: lblRname.innerText, required: true })
        lblRname.id = rmap.length - 1;
    }
    else {
        ele.innerText = 'add';
        icnPin.innerText = '';
        lstUnAttached.append(parentDiv);
        const idx = rmap.findIndex(item => { return ((item.sid == lstSvcs2.value) && (item.tid == parentDiv.id)) })
        if (!rmap[idx].mid)
            rmap.splice(idx, 1);            
    }
    const lblCart = get('lblCart');
    lblCart.innerText = 'Unsaved resource linkages - ' + rmap.length;
    lblCart.style.color = (rmap.length > 0) ? 'red' : 'black'
}

function saveCart() {
    const params = { method: 'POST', headers: { 'Accept': 'application/json' }, body: '' }
    params.body = JSON.stringify({ bid: bid, rmap: rmap });
    fetch('saveresmap', params)
        .then(resp => resp.text()
            .then(txt => console.log(txt))
            .catch(err => console.log(err)))
        .catch(err => console.log(err));
}