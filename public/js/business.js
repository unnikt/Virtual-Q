
const lstBus = document.getElementById('lstBus');

function fetchBusiness() {
    const uid = auth.currentUser.uid;
    if (!lstBus.value)
        if (uid)
            fetch('getbid?uid=' + uid)
                .then(resp => resp.json()
                    .then(data => loadBusiness(JSON.parse(data)))
                    .catch(err => "404.html?err=" + err))
                .catch(err => "404.html?err=" + err)
        else lstBus.hidden = true;
}
function loadBusiness(data) {
    if (data) data.forEach(e => {
        const opt = create('option');
        opt.innerText = e.bname; opt.value = e.bid; opt.id = data.bid;
        lstBus.appendChild(opt);
    });
    (bid) ? lstBus.value = bid : setBid();
    lstBus.style.display = 'block';
}

function setBid() { bid = lstBus.value; }
function redirect(page) { window.location = page + bid; }
