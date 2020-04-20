var divGridContainer = document.getElementById('grid-calendar');
var tmpRows = "1fr"; //First row has height of 2 fractions is the header row
var tmpCols="100px"; //First Column displays time




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
    var dt = new Date();
    var hh = ("0"+dt.getHours()).slice(-2);
    var mm = ("0"+dt.getMinutes()).slice(-2);
    // var ss = ("0"+dt.getSeconds()).slice(-2);
    // var ap="AM: ";
    // (hh>11) ? ap="PM: " : ap="AM: ";
    // (hh>12) ? hh-12:hh=hh;
    return(hh+":"+mm);
}

function update_cell(txt,row,col){
    var gcols = parseInt(divGridContainer.getAttribute('data_cols'));
    var gRows = parseInt(divGridContainer.getAttribute('data_rows'));

    if (row>gRows) return;

    if(col>gcols) {
        col=gcols+1;
        createNewCol(col); //Create new Column
    }
    
    var divID = 'div-'+ row + '-' + col;     
    var divSlot = document.getElementById(divID)
    divSlot.innerText =txt;
}

function createNewCol(col){
    if(col>1) tmpCols = tmpCols + " 150px";
    divGridContainer.style.gridTemplateColumns = tmpCols;
    divGridContainer.setAttribute('data_cols',col);
    var nRows = divGridContainer.getAttribute('data_rows');
    for (i=1;i<=nRows;i++){
        var divSlot = document.createElement('div');
        divSlot.setAttribute('id','div-'+ i + '-' + col);
        divSlot.style.gridArea = i + '/' + col + '/ span 1 / span 1';
        if(col>1)
        {   divSlot.addEventListener('click', function(e){
                // alert(this.id);
                var txt_slot = document.getElementById('txt_slot')
                txt_slot.setAttribute('data_div',this.id);
                txt_slot.innerText =null;
                document.getElementById('popup-slot').style.display ="block";
            });
        }
        
        // divSlot.innerHTML= '<i class="material-icons" style="float:right;font-size:4px">settings_ethernet</i>';
        divGridContainer.appendChild(divSlot);        
    }
}

function draw_timeline(ts,tf,ti_mins){
    //Create the first Column
    divGridContainer.style.gridTemplateColumns = tmpCols;
    divGridContainer.setAttribute('data_cols',1);

    //Create rows - To plot 9am to 11am in 30min intervals will require (2 * (60/30) + 1) rows
    var nRows = (tf-ts)*60/ti_mins; 
    divGridContainer.setAttribute('data_rows',nRows+2);

    var MM =0; var HH = ts; var ti = ti_mins/60;
    createNewCol(1);   // Create a new column
    update_cell('Time',1,1); // Set the header
    for(i=0;i<=nRows;i++) {
        MM = (ti_mins*i)%60; // Convert i to minutes
        HH = (ts + Math.floor(i*ti)); // increment hour
        update_cell(HH + ":" + padRight(MM),i+2,1); // update the cell
    }
}

