var actvTab = get('btnAdd');
var actvDiv = get('dvNewService');
const dvServices = get('dvServices');
const lstSvcs = get('lstSvcs');

// btnAdd.addEventListener('click', (ev) => { actvDiv.style.display = "block"; setTab(ev.target,'dvNewService') });
// btnClose.addEventListener('click', () => { actvDiv.style.display = "none"; })
lstSvcs.addEventListener('change', () => {
    if (lstSvcs.value) {
        fetchEvents('dvEvents', 'sid', lstSvcs.value);
        get('divEvnts-container').hidden = false;
    }
});

setTab(actvTab, 'dvNewService');
function setTab(el, dv) {
    actvTab.style.border = "none"; actvTab = el;
    el.style.borderBottom = "2px solid var(--secondary-color)";
    actvDiv.hidden = true; actvDiv = get(dv); actvDiv.hidden = false;
    dvServices.hidden = (dv === 'dvNewService') ? true : false; 
}