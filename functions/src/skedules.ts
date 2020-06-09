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
            (bid) ? res.render('skedules', { layout: 'main' }) : res.render('skedules', { layout: 'main' });
        }
    }));

skedules.post('/saveslot', (req, res) =>
    cors(req, res, () => {
        const data = req.body;
        const ev = data.event;
        const ts = firebase.firestore.Timestamp;
        const event = { bid: ev.bid, bname: ev.bname, sid: ev.sid, svc: ev.svc, uid: ev.uid, start: ts.fromDate(new Date(ev.start)), end: ts.fromDate(new Date(ev.end)), status: 'new' }

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

skedules.post('/checkin', (request, response) =>
    cors(request, response, () => {
        const form = request.body;
        if (form) {
            response.render('checkin', { aid: form.aid, bname: form.bname, sname: form.sname, start: form.start, end: form.end });
        }
        else
            response.render('error', { title: "Checkin", msg: "No data found" });
    }));

exports.skedules = functions.https.onRequest(skedules);

// function ts2DateTime(ts: firebase.firestore.Timestamp) {
//     const dt = new Date(ts.seconds * 1000);
//     const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//     const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//     let dateTime = [days[dt.getDay()], months[dt.getMonth()], dt.getDate(), dt.getFullYear(), ' '].join(' ');
//     dateTime = dateTime + [dt.getHours(), lpad(dt.getMinutes())].join(':');
//     // dateTime = [dateTime, dt.getTimezoneOffset()].join(' ');
//     return (dateTime);
// }

// function lpad(num: number) { return (num < 10) ? '0' + num : num; }