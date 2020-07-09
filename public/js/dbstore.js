function addDoc(doc) {
    const options = {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(doc)};
    var fret="";
    fetch("/add",options)
    .then (res =>{ return res.text();})
    .then (text => {fret = text;})
    .catch (err =>{fret = err;})
    return fret;
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