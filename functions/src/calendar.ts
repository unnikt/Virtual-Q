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

calendar.get("/calendar", (req, res) =>
    cors(req, res, () => {
        const uid = req.query.uid; const bid = req.query.bid; const sid = req.query.sid;
        const field = (uid) ? 'uid' : (bid) ? 'bid' : (sid) ? 'sid' : null;
        if (field === null) res.render('error', { title: "Can't get schedule", msg: "Missing parameters..." });
        else if ((uid) && (bid)) {
            const data: { bid: string, bname: string }[] = [];
            db.collection('business').where('uid', '==', uid).get()
                .then(snaps => {
                    snaps.forEach(doc => data.push({ bid: doc.id, bname: doc.data().bname }));
                    if (data.length > 0) res.render('calendar', { layout: 'mainb', bus: data, bid: bid, sid: sid });
                    else res.redirect('calendar?uid=' + uid);
                })
                .catch(err => res.render('error', { title: '/home - ', msg: err }));
        }
        else res.render('calendar', { layout: 'main', uid: uid });
    }));

calendar.post('/saveslot', (req, res) =>
    cors(req, res, () => {
        const ev = req.body.slot; const user = req.body.user; const rsel = req.body.rsel;
        const ts = firebase.firestore.Timestamp;
        const event = {
            bid: ev.bid, bname: ev.bname, sid: ev.sid, svc: ev.svc, uid: ev.uid, uname: [user.fname, user.sname].join(' '),
            start: ts.fromMillis(ev.start), end: ts.fromMillis(ev.end), status: 'new'
        }

        const revents: { tid: string, rid: string, start: firebase.firestore.Timestamp, end: firebase.firestore.Timestamp }[] = [];
        rsel.forEach((itm: { tid: any; rid: any; }) => revents.push({ tid: itm.tid, rid: itm.rid, start: event.start, end: event.end }));

        // const aid = null;
        if (ev.uid)
            db.collection('appointments').add(event)
                .then(result => { res.send(result); })
                .catch(err => { res.send(err); });
        else {
            db.collection('users').add(user)
                .then(usr => {
                    event.uid = usr.id;
                    console.log(event);
                    db.collection('appointments').add(event)
                        .then(result => { res.send(result); })
                        .catch(err => { res.send(err); });
                })
                .catch(err => res.send(err))
        }

        // if user does not exisit --> create user
        // Create appointment and get AID
        // for each resource check 
        //if slot is taken 
        // delete revents having AID; delete AID; return error;
        // if not write revent
        // const bRef = db.collection('business').doc(ev.bid);
        // revents.forEach(itm => {
        //     const reventRef = bRef.collection('revents')
        //         .where('rid', '==', itm.rid)
        //         .where('start', '>=', itm.start)
        //         .where('start', '<=', itm.end);
        //     db.runTransaction(transaction => {
        //         return transaction.get(reventRef)
        //             .then(snaps => {
        //                 if (snaps.empty) bRef.collection('revents').doc().create(itm);
        //                 else throw itm.rid + "not available";
        //             })
        //     }).then(() => { res.send("Successful") })
        //         .catch(err => {
        //             bRef.collection('revents').where('aid', '==', aid);
                    
        //             res.send(err)
        //         });
        // });

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

