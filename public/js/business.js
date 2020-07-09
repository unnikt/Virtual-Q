if (typeof bid === "undefined") setBid();
function setBid() {
    const lstBus = get('lstBus');
    bid = lstBus.value;
}
function fetchBusiness() {
    if (auth.currentUser) {
        uid = auth.currentUser.uid;
        let lstBus = get('lstBus');
        if (!lstBus.value)
            fetch('getbid?uid=' + uid)
                .then(resp => resp.json()
                    .then(data => loadBusiness(JSON.parse(data)))
                    .catch(err => "404.html?err=" + err))
                .catch(err => "404.html?err=" + err)
        else lstBus.hidden = true;
    }
}
function loadBusiness(data) {
    const lstBus = get('lstBus');
    if (data) data.forEach(e => {
        const opt = create('option');
        opt.innerText = e.bname; opt.value = e.bid; opt.id = data.bid;
        lstBus.appendChild(opt);
    });
    (bid) ? lstBus.value = bid : setBid();
    lstBus.style.display = 'block';
}

function redirect(page) { window.location = page + bid; }
fetchBusiness();