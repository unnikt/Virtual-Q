import * as admin from 'firebase-admin';
import functions = require('firebase-functions');
import corsMod = require('cors');

import express = require('express');
import vwengine = require('express-handlebars');

//Set up view engine
const db = admin.firestore();
const events = express();
events.engine('hbs', vwengine({
    extname: 'hbs',
    defaultLayout: "main", layoutsDir: './views/layouts/'
}));
events.set('views', './views'); //Set the views folder
events.set('view engine', 'hbs'); //view the engine
events.use(express.json({ limit: '1mb' })); //set up to receive data in JSON format

const cors = corsMod({ origin: true });
// const db = firebase.firestore();

events.post("/getevents", (req, res) =>
    cors(req, res, () => {
        const inp = JSON.parse(req.body);
        const id = inp.id; const val = inp.val;
        const start = new Date(inp.year, inp.month, 1);
        const end = new Date(inp.year, inp.month + 1, 0);
        start.setHours(0, 0, 0);
        end.setHours(23, 59, 59, 59);

        // console.log("/getevents");
        const data: {
            events: {
                aid: string, start: string, end: string, status: string,
                bname: string, sname: string, uname: string
            }[]
        } = { events: [] };
        if (id && val)
            db.collection('appointments')
                .where(id, '==', val).where('start', '>=', start).where('start', '<=', end)
                // .where('status', 'in', ['On time','Delayed','Arrived','Reschedule'])         //Status = On time,Delayed,Arrived,Cancelled,Reschedule,Completed
                .orderBy('start').get()
                .then(results => {
                    results.forEach(doc => data.events.push({
                        aid: doc.id,
                        start: doc.data().start,
                        end: doc.data().end,
                        bname: doc.data().bname,
                        sname: doc.data().svc,
                        uname: doc.data().uname,
                        status: doc.data().status
                    }));
                    res.json(data);
                })
                .catch(err => res.json({ title: 'getevents', msg: err }));
        else
            res.json(data);
    }));

events.post("/evntstatus", (req, res) =>
    cors(req, res, () => {
        console.log(req);
        const frm = JSON.parse(req.body);
        console.log(frm);
        //Status = On time,Delayed,Arrived,Cancelled,Reschedule,Completed
        if (frm.status === 'GET')         //if status is 'GET' then return status all others update status.
            db.collection('appointments').doc(frm.aid).get()
                .then(doc => {
                    const data = doc.data();
                    if (data) res.send(frm.aid + "status is " + data.status);
                })
                .catch(err => res.send("Status update failed " + err));
        else
            db.collection('appointments').doc(frm.aid).update({ status: frm.status })
                .then(resp => res.send(frm.aid + ' Status set to ' + frm.status))
                .catch(err => res.send("Status update failed " + err));
    }));


exports.events = functions.https.onRequest(events);