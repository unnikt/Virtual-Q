import firebase = require('firebase-admin');
import functions = require('firebase-functions');
import corsMod = require('cors');

import express = require('express');
import vwengine = require('express-handlebars');

//Set up view engine
const skedules = express();
skedules.engine('hbs', vwengine({
    extname: 'hbs',
    defaultLayout: "main", layoutsDir: './views/layouts/'
}));
skedules.set('views', './views'); //Set the views folder
skedules.set('view engine', 'hbs'); //view the engine
skedules.use(express.json({ limit: '1mb' })); //set up to receive data in JSON format

const cors = corsMod({ origin: true });
const db = firebase.firestore();

skedules.get("/skedules", (req, res) =>
    cors(req, res, () => {
        const uid = req.query.uid;
        const bid = req.query.bid;
        const field = (uid) ? 'uid' : (bid) ? 'bid' : null;
        // const val = (uid) ? uid : (bid) ? bid : null;

        if (field === null)
            res.render('error', { title: "Can't get schedule", msg: "No uid or bid specified..." });
        else {
            let start = new Date();
            if (req.query.from) start = new Date(req.query.from.toString());
            let end = new Date();
            if (req.query.to) end = new Date(req.query.to.toString())
            else end = new Date(start.getFullYear(), start.getMonth(), start.getDate());

            start.setHours(0, 0, 0);
            end.setHours(23, 59, 59);

            res.render('skedules');
        }
    }));

skedules.post('/saveslot', (req, res) =>
    cors(req, res, () => {
        const data = req.body;
        const ev = data.event;
        const ts = firebase.firestore.Timestamp;
        const event = { bid: ev.bid, sid: ev.sid, uid: ev.uid, start: ts.fromDate(new Date(ev.start)), end: ts.fromDate(new Date(ev.end)) }
        console.log(event);
        if (data.event.uid)
            db.collection('appointments').add(event)
                .then(result => { res.send(result); })
                .catch(err => { res.send(err); });
        else {
            db.collection('users').add(data.user)
                .then(usr => {
                    data.event.uid = usr.id;
                    db.collection('appointments').add(event)
                        .then(result => { res.send(result); })
                        .catch(err => { res.send(err); });
                })
                .catch(err => res.send(err))
        }
    }));

skedules.get('/newslot', (req, res) =>
    cors(req, res, () => {
        //TODO - remove hard coding
        const pid = "Xza438iMfuiZtwF8t8Zs";
        res.set('content-type', 'text/html');
        const params: { svcs: { sname: String }[] } = { svcs: [] };
        db.collection("/providers/" + pid + "/services/").get()
            .then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    params.svcs.push({ sname: doc.get("sname") });
                })
                res.render('newslot', params);
            })
            .catch(err => res.send("/newslot" + err))
    }));

skedules.get('/editslot', (req, res) =>
    cors(req, res, () => {
        res.set('content-type', 'text/html');
        res.render('editslot', { sid: req.query.id });
    }));

skedules.get('/delslot', (req, res) =>
    cors(req, res, () => {
        res.set('content-type', 'text/html');
        db.doc("/appointments/" + req.query.id).delete()
            .then(result => { res.send("Deletion succeeded.") })
            .catch(error => { res.send("Deletion failed..." + error); })
    }));

skedules.get('/checkin', (request, response) =>
    cors(request, response, () => {
        const aid: string = (request.query.aid) ? request.query.aid.toString() : "";
        // response.set('content-type', 'text/html');
        if (aid === null)
            response.render('error', { title: "ErrorError[SK01]", msg: "No such booking found..!" });
        db.collection('appointments').doc(aid).get()
            .then(doc => {
                const data = doc.data();
                if (data)
                    response.render('checkin', { aid: aid, bname: data.pid, when: data.from.toDate() });
            })
            .catch(err => response.render('error', { title: "Error[SK02]", msg: "No such booking found..!" }))
    }));

// function getBusyDays(uid:string,year:number, month:number) {
//     const dfirst = new Date(year, month, 1);
//     const dlast = new Date(year, month + 1, 0);
//     // const busydays:string [] = [];
//     return db.collection('appointments')
//         .where('uid', '==', uid)
//         .where('from', '>=', dfirst)
//         .where('from', '<=', dlast).get()
// }



exports.skedules = functions.https.onRequest(skedules);