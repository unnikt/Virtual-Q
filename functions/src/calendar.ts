import firebase = require('firebase-admin');
import functions = require('firebase-functions');
import corsMod = require('cors');

import express = require('express');
import vwengine = require('express-handlebars');

//Set up view engine
const calendar = express();
calendar.engine('hbs', vwengine({
    extname: 'hbs',
    defaultLayout: "main", layoutsDir: './views/layouts/'
}));
calendar.set('views', './views'); //Set the views folder
calendar.set('view engine', 'hbs'); //view the engine
calendar.use(express.json({ limit: '1mb' })); //set up to receive data in JSON format

const cors = corsMod({ origin: true });
const db = firebase.firestore();

calendar.get("/skedules", (req, res) =>
    cors(req, res, () => {
        const uid = req.query.uid;
        const bid = req.query.bid;
        const field = (uid) ? 'uid' : (bid) ? 'bid' : null;
        // const val = (uid) ? uid : (bid) ? bid : null;
        if (field === null)
            res.render('error', { title: "Can't get schedule", msg: "No uid or bid specified..." });
        else {
            (bid) ? res.render('calendar', { layout: 'mainb' }) : res.render('calendar', { layout: 'main' });
        }
    }));

calendar.post('/saveslot', (req, res) =>
    cors(req, res, () => {
        const data = req.body;
        const ev = data.event;
        const user = data.user;
        const ts = firebase.firestore.Timestamp;
        const event = {
            bid: ev.bid, bname: ev.bname, sid: ev.sid, svc: ev.svc, uid: ev.uid, uname: [user.fname, user.sname].join(' '),
            start: ts.fromDate(new Date(ev.start)), end: ts.fromDate(new Date(ev.end)), status: 'new'
        }

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

calendar.post('/checkin', (request, response) =>
    cors(request, response, () => {
        const form = request.body;
        if (form) {
            response.render('checkin', { aid: form.aid, bname: form.bname, sname: form.sname, start: form.start, end: form.end });
        }
        else
            response.render('error', { title: "Checkin", msg: "No data found" });
    }));

exports.calendar = functions.https.onRequest(calendar);

