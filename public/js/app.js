const auth = firebase.auth();
auth.onAuthStateChanged(user => {
    if (!user) window.location = "/";
    else if (!user.emailVerified) window.location = "emailverify.html?email=" + user.email;
});

// Global Query parameters
const urlParams = new URLSearchParams(window.location.search);
var uid = urlParams.get('uid'); var bid = urlParams.get('bid'); const sid = urlParams.get('sid');

function togmenu() {
    const mainNav = get('mainNav').style;
    mainNav.left = (mainNav.left == '100%') ? "0%" : '100%';
}

//Core UI control functions~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function fold(iid, eid) {
    var elm = get(eid); (elm.hidden) ? elm.hidden = false : elm.hidden = true;
    var icn = get(iid); (icn.innerText == 'expand_more') ? icn.innerText = 'expand_less' : icn.innerText = 'expand_more';
}
function create(el) { return document.createElement(el) }
function get(el) { return document.getElementById(el); }
function disp(el, opt) { el.style.display = opt; }
function hide(el) { get(el).style.display = 'none'; }
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

