function toast(msg) {
    var toast = get('toast');
    if (toast == null) {
        toast = create('div'); toast.setAttribute('class', 'toast'); toast.id = 'toast'; document.body.append(toast);
    }
    toast.innerText = msg;
    setTimeout(() => { document.body.removeChild(toast);}, 1000);
    
}

function spinner(action) {
    var mod_Container = get('busy-bee');
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
    var modForm = get('modal-form');
    if (modForm == null) {
        modForm = create('div');
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
    get('title').innerText = title;
    get('msg').innerText = msg;
    disp(get('msg'), "block");
    disp(modForm, "block");
}