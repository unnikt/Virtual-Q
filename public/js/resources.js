var rtypes;
const loadData = async () => {
    spinner('start');
    const response = await fetch('getResTypes?bid=' + bid);
    rtypes = await response.json();
    rtypes.forEach(rec => {
        showResTypes(rec);
        loadSelTypes(rec);
    });
    // ** Start Fetch getResTypes
    fetch('getResources?bid=' + bid)
        .then(res => res.json()
            .then(types => {
                types.forEach(ele => {
                    showResources(ele);
                })
            })
            .catch(err => console.log(err)))
        .catch(err => console.log(err));
    // ** End of getResTypes
    spinner('stop')
}
loadData();

function filterList(search, list, incr) {
    if (!search) search = 'filter';
    if (!list) list = 'dvResList';
    if (!incr) incr = 3;

    const dvResList = get(list).children; const records = dvResList.length; const filter = get(search).value.toUpperCase();
    var recVal;
    for (i = 0; i < records; i += incr) {
        recVal = [dvResList[i].innerText, dvResList[i + 1].innerText, dvResList[i + 2].innerText].join(' ');
        let disp = (recVal.toUpperCase().indexOf(filter) > -1) ? "block" : "none";
        dvResList[i].style.display = dvResList[i + 1].style.display = dvResList[i + 2].style.display = disp;
    }
}

const dvResList = get('dvResList');
function showResources(ele) {
    const dvCode = create('div'); const dvName = create('a'); const dvType = create('div');
    // const dvCode = create('div'); const dvName = create('div'); const dvType = create('div');

    dvName.setAttribute('href','calendar?rid=' + ele.rid)
    dvName.innerText = ele.rname; dvCode.innerText = ele.rcode;
    const rtype = rtypes.find(item => { return item.tid == ele.rtype })
    dvType.innerText = rtype.rtype;
    dvResList.append(dvType); dvResList.append(dvName); dvResList.append(dvCode);
}

const selType = get('selType');
function loadSelTypes(ele) {
    const opt = create('option');
    opt.value = ele.tid; opt.innerText = ele.rtype;
    selType.append(opt);
}

const lstResType = get('lstResType');
function showResTypes(ele) {
    const li = create('li'); const icn = create('i');
    icn.setAttribute('class', "material-icons fltr nopad nomgn");
    icn.addEventListener('click', () => delResType(ele.tid));
    icn.innerText = 'delete';
    li.innerText = ele.rtype; li.append(icn);
    li.addEventListener('click', () => showResbyType(ele.rtype));
    lstResType.append(li);
}
function showResbyType(type) {
    setTab(get('tab2'), 'dvResources');
    get('filter').value = type;
    filterList();
}

get('frm1-bid').value = get('frm2-bid').value = get('frm3-bid').value = bid;
function delResType(id) {
    get('frm3-type').value = id;
    const rtype = rtypes.find(item => { return item.tid == id })
    if (rtype)
        toast("Cannot Delete: There are resources mapped to this type")
    else
        get('frmDelResType').submit();
}

const dvNewType = get('dvNewType').style;
get('btnAddType').addEventListener('click', (e) => {
    dvNewType.display = (dvNewType.display == 'block') ? 'none' : 'block';
    get('icnNew').innerText = (dvNewType.display == 'block') ? 'close' : 'add';
})
const dvNewRes = get('dvNewRes').style;
get('btnAddRes').addEventListener('click', (e) => {
    dvNewRes.display = (dvNewRes.display == 'block') ? 'none' : 'block';
    get('icnNewRes').innerText = (dvNewRes.display == 'block') ? 'close' : 'add';
})
setTab(get('tab1'), 'dvResType');