// Global Query parameters
const urlParams = new URLSearchParams(window.location.search);
const uid = urlParams.get('uid'); const bid = urlParams.get('bid'); const sid = urlParams.get('sid');

function toast(msg) {
    var toast = get('toast');
    if (toast == null) { toast = create('div'); toast.setAttribute('class', 'toast'); toast.id = 'toast'; }
    toast.innerText = msg;
    document.body.append(toast);
    setTimeout(() => { toast.style.opacity = 0; }, 500);
}

function spinner(action) {
    var mod_Container = document.getElementById('busy-bee');
    if ((action == "stop") && (mod_Container != null)) mod_Container.parentNode.removeChild(mod_Container);
    else {
        if (mod_Container == null) {
            mod_Container = document.createElement('div');
            mod_Container.setAttribute('class', "mod-container");
            mod_Container.setAttribute('id', "busy-bee");
            mod_Container.innerHTML = "<div class='lds-dual-ring'></div>"
            document.body.append(mod_Container);
        }
        mod_Container.style.display = "block";
    }
}

function showError(title, msg) {
    var modForm = document.getElementById('modal-form');

    if (modForm == null) {
        modForm = document.createElement('div');
        modForm.setAttribute('class', "modal-form");
        modForm.setAttribute('id', "modal-form");
        modForm.innerHTML =
            "<div  class='modal-content'> \
            <h3 id='title' class='mod-header bbdr'></h3> \
            <span id='msg' style='display:block;padding:0.5em;'></span> \
            <button style='width:100px' onclick=document.getElementById('modal-form').style.display='none'>OK</button> \
        </div>"
        document.body.append(modForm);
    }
    document.getElementById('title').innerText = title;
    document.getElementById('msg').innerText = msg;
    document.getElementById('msg').style.display = "block";
    modForm.style.display = "block";
}

function deldoc(type, id, target) {
    spinner("start");
    fetch("/delete?type=" + type + "&id=" + id)
        .then(res => {
            if (res.status == 200) window.location = target;
            else showError('Error', "Deletion fialed...")
        })
        .catch(err => {
            console.log(err);
        });
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

