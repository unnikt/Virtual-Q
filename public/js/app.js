const auth = firebase.auth();
auth.onAuthStateChanged(user => { (user) ? fetchBusiness() : window.location = "/" });
// Global Query parameters
const urlParams = new URLSearchParams(window.location.search);
var uid = urlParams.get('uid'); var bid = urlParams.get('bid'); const sid = urlParams.get('sid');

function togmenu() {
    const mainNav = get('mainNav').style; const mainIcn = get('mainIcn');
    if (mainNav.height == '100%') { mainNav.height = "0"; mainIcn.innerText = 'menu'; }
    else { mainNav.height = '100%'; mainIcn.innerText = 'expand_less'; }
}

//Core UI control functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function fold(iid, eid) {
    var elm = get(eid); (elm.hidden) ? elm.hidden = false : elm.hidden = true;
    var icn = get(iid); (icn.innerText == 'expand_more') ? icn.innerText = 'expand_less' : icn.innerText = 'expand_more';
}
function create(el) { return document.createElement(el) }
function get(el) { return document.getElementById(el); }
function disp(el, opt) { el.style.display = opt; }
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

