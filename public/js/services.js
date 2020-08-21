var Rtypes, Ra, Rd = [];

//Alter the default lstBus change event to set the inpBid value if changed 
const lstBus = get('lstBus'); const inpBid = get('inpBid');
inpBid.value = lstBus.value;
lstBus.addEventListener('change', () => { inpBid.value = lstBus.value });
//*************************/

const loadResources = async () => {
    const response = await fetch('getresmap?bid=' + bid);
    resp = await response.json();
    // resp = { "Ra": [{ "mid": "DLrW2xXDiJhonP0V30bq", "sid": "1UnKreNbOL3Lv3cUdNl6", "required": true, "tid": "cr4yUEdrIlzG6qkoVLJb", "rtype": "Instructor(CFI)" }, { "mid": "nbFZMB6zoLVcm5nhlwE4", "sid": "1UnKreNbOL3Lv3cUdNl6", "required": true, "tid": "1NFRrWdV79Iv3HwD5W5K", "rtype": "Aircraft" }, { "mid": "tMI2Yi29NKcUsnNqapmA", "sid": "1UnKreNbOL3Lv3cUdNl6", "required": true, "tid": "cr4yUEdrIlzG6qkoVLJb", "rtype": "Instructor(CFI)" }], "Rtypes": [{ "mid": "", "sid": "", "required": false, "tid": "1NFRrWdV79Iv3HwD5W5K", "rtype": "Aircraft" }, { "mid": "", "sid": "", "required": false, "tid": "cr4yUEdrIlzG6qkoVLJb", "rtype": "Instructor(CFI)" }] }

    Rtypes = resp.Rtypes;
    Ra = resp.Ra;
    Rd = [];
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
const lstSvc2Changed = () => {
    lstAttached.innerText = lstUnAttached.innerText = "";
    if (lstSvcs2.value) {
        const tmpAttached = Ra.filter(itm => (itm.sid == lstSvcs2.value));
        var tmpUnattached = Rtypes;
        tmpAttached.forEach(rec => {
            lstAttached.append(getResContainer(rec.tid, rec.rtype, 'push_pin', 'delete'));
            tmpUnattached = tmpUnattached.filter(itm => (itm.tid != rec.tid));
        })
        tmpUnattached.forEach(rec => {
            lstUnAttached.append(getResContainer(rec.tid, rec.rtype, '', 'add'));
        })
    }
}
lstSvcs2.addEventListener('change', lstSvc2Changed);

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
        const idx = Rd.findIndex(item => { return ((item.sid == lstSvcs2.value) && (item.tid == parentDiv.id)) })
        if (idx >= 0) {
            Ra.push(Rd[idx]);
            Rd.splice(idx, 1);
        }
        else
            Ra.push({ mid: "", sid: lstSvcs2.value, tid: parentDiv.id, rtype: lblRname.innerText, required: true })
        lblRname.id = Ra.length - 1;
    }
    else {
        ele.innerText = 'add';
        icnPin.innerText = '';
        lstUnAttached.append(parentDiv);
        const idx = Ra.findIndex(item => { return ((item.sid == lstSvcs2.value) && (item.tid == parentDiv.id)) })
        if (Ra[idx].mid)
            Rd.push(Ra[idx]);
        Ra.splice(idx, 1);
    }
    const lblCart = get('lblCart');
    const nDels = Rd.length;
    const nAdds = Ra.filter(x => { return x.mid == '' }).length;
    lblCart.innerText = 'Unsaved Additions: ' + nAdds;
    lblCart.innerText += '; Deletions: ' + nDels;
    lblCart.style.color = (nAdds + nDels > 0) ? 'red' : 'black'
}

function saveCart() {
    const params = { method: 'POST', headers: { 'Accept': 'application/json' }, body: '' }
    Rnew = Ra.filter(x => { return x.mid == '' }).map(x => { return { sid: x.sid, tid: x.tid, rtype: x.rtype, required: x.required } })
    Rdel = Rd.map(x => { return { mid: x.mid } });
    params.body = JSON.stringify({ bid: bid, Rn: Rnew, Rd: Rdel });
    fetch('saveresmap', params)
        .then(resp => resp.json()
            .then(rjson => refreshPage(rjson))
            .catch(err => console.log(err)))
        .catch(err => console.log(err));
}

function refreshPage(rjson) {
    // console.log(rjson);
    const lblCart = get('lblCart');
    lblCart.innerText = rjson.msg;
    lblCart.style.color = 'black';
    lstSvcs2.selectedIndex = 0;
    loadResources();
    lstSvc2Changed();
}