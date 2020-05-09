function addDoc(doc){
    const options = {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(doc)};
    var fret="";
    fetch("/add",options)
    .then (res =>{ return res.text();})
    .then (text => {fret = text;})
    .catch (err =>{fret = err;})
    return fret;
}