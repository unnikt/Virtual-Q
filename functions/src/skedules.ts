import firebase =  require('firebase-admin');
import functions = require('firebase-functions');
import corsMod =  require('cors');

import express = require('express');
import vwengine = require('express-handlebars');

//Set up view engine
const skedules = express();
skedules.engine('hbs', vwengine({extname:'hbs',
        defaultLayout:"main", layoutsDir:'./views/layouts/'}));
skedules.set('views','./views'); //Set the views folder
skedules.set('view engine','hbs'); //view the engine
skedules.use(express.json({limit:'1mb'})); //set up to receive data in JSON format

const cors = corsMod({origin:true});
const db = firebase.firestore();

skedules.get("/skedules", (req,res) =>
cors(req,res,() =>{
    const pid = req.query.pid;
    
    let from = new Date();
    if (req.query.from) from = new Date(req.query.from.toString());
    let to = new Date();
    if (req.query.to) to = new Date(req.query.to.toString());

    from.setHours(0, 0, 0, 0);
    to.setHours(23, 59, 0, 0);
    
    const sfrom = from.getFullYear() + '-' + 
                ('0' + (from.getMonth() + 1)).slice(-2) + '-' + ('0' + from.getDate()).slice(-2);
    const sto = to.getFullYear() + '-' + 
                ('0' + (to.getMonth() + 1)).slice(-2) + '-' + ('0' + to.getDate()).slice(-2);

    const dtrange = {from:sfrom, to:sto};
    
    if(pid===null) 
        res.send("No pid specified...");
    else {
        db.collection('appointments')
            .where('from','>=',from)
            .where('from','<',to)
            .orderBy('from')
            .get()
            .then(querySnapshot=>{
            const colSkeds:{id:string,tstamp:number, date:string,from:string,to:Date,cusname:string,
                            cusid:string,svcname:string,svcid:string,status:string}[] =[];
            querySnapshot.forEach(doc=>{
                const sked = doc.data();
                sked.id = doc.id;
                const dt = sked.from.toDate();
                let hh = dt.toLocaleTimeString().slice(0,2);
                const mm = dt.toLocaleTimeString().slice(3,5);
                let AP;(hh>12)?hh=hh-12:hh=hh; (hh>11)?AP="PM":AP="AM";
                
                colSkeds.push({id:sked.id, tstamp:dt.getTime(),
                    date:dt.toDateString(),
                    from:hh + ":" + mm + " " + AP,
                    to:sked.to.toDate(),
                    cusname:sked.cusname,
                    cusid:sked.cusid,
                    svcname:sked.svcname,
                    svcid:sked.svcid,
                    status:sked.status});
            });
            res.set('content-type', 'text/html');
            res.render('skedules',{skeds:colSkeds,dtrange:dtrange});
        })
        .catch(error=>{
            res.send(error);
        })
        }   
    }));

skedules.post('/saveslot',(req,res) =>
cors(req,res,()=>
    {   const data = req.body;
        const doc = {
            "cusid":data.cusid, "cusname":data.cusname,
            "from":firebase.firestore.Timestamp.fromDate(new Date(data.from)), 
            "to":firebase.firestore.Timestamp.fromDate(new Date(data.to)),
            'svcid':data.svcid, 'svcname':data.svcname,'pid':data.pid};
        db.collection('/appointments').add(doc)
        .then(result=>{res.send(result);})
        .catch(err =>{res.send(err);});
    }));

skedules.get('/newslot',(req,res) =>
cors(req,res,()=>
{
    const pid = "Xza438iMfuiZtwF8t8Zs";
    res.set('content-type', 'text/html');
    const params: { svcs: { sname: String }[] } = { svcs: [] };
    db.collection("/providers/" + pid + "/services/").get()
        .then(querySnapshot => {
            querySnapshot.forEach(doc => {
                params.svcs.push({ sname: doc.get("sname")});                       
            })
            res.render('newslot',params);
        })
    .catch(err => res.send("/newslot"+ err))
}));

skedules.get('/editslot',(req,res) =>
cors(req,res,()=>
{   res.set('content-type', 'text/html');
    res.render('editslot',{sid:req.query.id});
}));

skedules.get('/delslot',(req,res) =>
cors(req,res,()=>
{   res.set('content-type', 'text/html');
    db.doc("/appointments/" + req.query.id).delete()
    .then(result =>{res.send("Deletion succeeded.")})
    .catch(error =>{res.send("Deletion failed..." + error);})
}));

skedules.get('/checkin', (req, res) =>
    cors(req, res, () => {
        res.set('content-type', 'text/html');
        res.render('checkin', { pid: req.query.id }); //TO DO - pass appointment id here
    }));


exports.skedules = functions.https.onRequest(skedules);