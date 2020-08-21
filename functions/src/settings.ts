import express = require('express');
import hbEngine = require('express-handlebars');
import * as corsMod from 'cors';
import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
import { getBusinesses } from './common';

const settings = express();
const cors = corsMod({ origin: true });
const db = admin.firestore();

//Set up view engine
settings.engine('hbs', hbEngine({
    extname: 'hbs',
    defaultLayout: "main", layoutsDir: './views/layouts/'
}));
settings.set('views', './views'); //Set the views folder
settings.set('view engine', 'hbs'); //view the engine
settings.use(express.json({ limit: '1mb' })); //set up to receive data in JSON format

// This function sign's out the user 
settings.get('/settings', (request, response) => cors(request, response, () => {
    const bid = request.query.bid;
    const uid = request.query.uid?.toString();
    let bShowMsg = false; let msg = "";
    if (request.query.lwt) { bShowMsg = true; msg = "Changes to user details were updated..."; }
    if (request.query.usr) { bShowMsg = true; msg = "User details missing... Please update user profile to proceed..."; }

    if (uid) getBusinesses(uid)
        .then(bus => db.collection('users').doc(uid).get()
            .then(doc => {
                const d = doc.data();
                if (d) {
                    const usr = { uid: uid, fname: d.fname, sname: d.sname, email: d.email, phone: d.phone }
                    const bflag = (bid) ? true : false;
                    response.render('settings', {
                        layout: (bflag) ? 'mainb' : 'main',
                        uid: uid, usr: usr,
                        isBusiness: bflag, bid: bid,
                        bShowMsg: bShowMsg, msg: msg,
                        bus: bus
                    });
                }
                else throw new Error("virq/get/settings/user details not found..")
            })
            .catch(err => response.render('error', { code: -1, loc: 'get/settings', msg: err })))
        .catch(err => response.render('error', { code: -1, loc: 'get/settings', msg: err }))
    else
        response.render('error', { code: -1, loc: 'get/settings', msg: 'UID is missing' })
}));

settings.post("/updateuser", (req, res) =>
    cors(req, res, () => {
        const data = req.body;
        const uid = data.uid; const bid = data.bid;
        const bflag = (data.bflag) ? data.bflag : false;
        const newDoc = { business: bflag, fname: data.fname, sname: data.sname, email: data.email, phone: data.phone, bIncomplete: false };

        if ((!newDoc.fname) || (newDoc.fname === 'noname')) { newDoc.bIncomplete = true; }
        if ((!newDoc.sname) || (newDoc.sname === 'noname')) { newDoc.bIncomplete = true; }
        if ((!newDoc.email) || (newDoc.email === 'nomail')) { newDoc.bIncomplete = true; }
        if ((!newDoc.phone) || (newDoc.phone === 'notel')) { newDoc.bIncomplete = true; }

        let url = 'settings?uid=' + data.uid; if (bid) url += "&bid=" + bid;
        db.collection('users').doc(uid).set(newDoc)
            .then(docRef => {
                url += "&lwt=" + docRef.writeTime;
                url += (newDoc.bIncomplete) ? "&usr=true" : "";
                res.redirect(url);
            })
            .catch(err => res.render('error', { code: -1, loc: 'updateuser', msg: err }));
    }));

exports.settings = functions.https.onRequest(settings);