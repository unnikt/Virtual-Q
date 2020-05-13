function getDate(date) {
    var d = new Date(date),
    month = '' + (d.getMonth() + 1),day = '' + d.getDate(), year = d.getFullYear();
    return [year, padLeft(month), padLeft(day)].join('-');
}
function getDateTime(date) {
    var d = new Date(date);
    return [getDate(date),getTime(date)].join('T');
}
function getTime(date){
    var dt = new Date(date);
    var hh = ("0"+dt.getHours()).slice(-2);
    var mm = ("0"+dt.getMinutes()).slice(-2);
    // var ss = ("0"+dt.getSeconds()).slice(-2);
    // var ap="AM: ";
    // (hh>11) ? ap="PM: " : ap="AM: ";
    // (hh>12) ? hh-12:hh=hh;
    return(hh+":"+mm);
}

function yesterday(today) {
    var d = new Date(today);
    d.setDate(d.getDate() - 1); 
    return (getDate(d));
}
function tomorrow(today) {
    var d = new Date(today);
    d.setDate(d.getDate() + 1); 
    return (getDate(d));
}

// Attaching a new function  toShortFormat()  to any instance of Date() class

Date.prototype.toShortFormat = function () {

    var month_names = ["Jan", "Feb", "Mar",
        "Apr", "May", "Jun",
        "Jul", "Aug", "Sep",
        "Oct", "Nov", "Dec"];

    var day = this.getDate();
    var month_index = this.getMonth();
    var year = this.getFullYear();

    return "" + day + "-" + month_names[month_index] + "-" + year;
}

// Now any Date object can be declared 
var today = new Date();

function padRight(d) { return (d < 10) ? d.toString() + '0' : d.toString();}
function padLeft(d)  { return (d < 10) ? '0' + d.toString() : d.toString();}