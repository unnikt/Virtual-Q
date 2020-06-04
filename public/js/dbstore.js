// addDoc(Doc) -- Format
// var newDoc = {
//     "type": "document type (e.g: user,booking,service,business...)",
//     "doc": {
//         "field1": value1,
//         "field2": value2,
//         "field3": value3,
//         "field4": value4,
//     }
// };

function addDoc(doc) {
    const options = {method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(doc)};
    var fret="";
    fetch("/add",options)
    .then (res =>{ return res.text();})
    .then (text => {fret = text;})
    .catch (err =>{fret = err;})
    return fret;
}