const urlParams = new URLSearchParams(window.location.search);
var bid = urlParams.get('bid');
const lstBus = get('lstBus');

const auth = firebase.auth();
auth.onAuthStateChanged(user => {
    if (user) {
        fetch('getbid?uid=' + auth.currentUser.uid)
            .then(resp => resp.json()
                .then(data => {
                    loadBusiness(JSON.parse(data));
                })
                .catch(err => "404.html?err=" + err))
            .catch(err => "404.html?err=" + err)
    }
    else {
        if (ui) {
            get('mainNav').style.width = '0%';
            get('firebaseui-auth-container').style.display = 'block';
            var ui = new firebaseui.auth.AuthUI(auth);
            ui.start('#firebaseui-auth-container', uiConfig);
        }
        else window.location = "/";
    }
});



function loadBusiness(data) {
    if (data.length == 0) return;
    data.forEach(e => {
        const opt = create('option');
        opt.innerText = e.bname;
        opt.value = e.bid
        opt.id = data.bid;
        lstBus.appendChild(opt);
    })
    if (!bid) setBid();
    else lstBus.value = bid;
    disp(get('lstBus'), 'block');
}

function get(el) { return document.getElementById(el); }
function create(el) { return document.createElement(el); }

function setBid() { bid = lstBus.value; }
function redirect(page) { window.location = page + bid; }
