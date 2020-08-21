import admin = require('firebase-admin');
import functions = require('firebase-functions');
import corsMod = require('cors');

import express = require('express');
import vwengine = require('express-handlebars');

//Set up view engine
const db = admin.firestore();
const home = express();
home.engine('hbs', vwengine({
    extname: 'hbs',
    defaultLayout: "main", layoutsDir: './views/layouts/'
}));
home.set('views', './views'); //Set the views folder
home.set('view engine', 'hbs'); //view the engine
home.use(express.json({ limit: '1mb' })); //set up to receive data in JSON format

const cors = corsMod({ origin: true });
// const db = firebase.firestore();

home.get("/home", (req, res) =>
    cors(req, res, () => {
        const uid = req.query.uid?.toString();
        if (uid) db.collection('users').doc(uid).get()
            .then(usr => {
                const dat = usr.data();
                if ((dat) && (dat.bIncomplete)) res.redirect('settings?uid=' + uid + "&usr=true"); //1. User details incomplete
                else {
                    const data: { bid: string, bname: string }[] = [];
                    db.collection('business').where('uid', '==', uid).get()
                        .then(snaps => {
                            snaps.forEach(doc => data.push({ bid: doc.id, bname: doc.data().bname }));
                            if (data.length > 0) res.render('homeb', { layout: 'mainb', bus: data }); //2. Logged in user has Business(es) set up
                            else res.redirect('calendar?uid=' + uid); //3. User is not a Business
                        })
                        .catch(err => res.render('error', { title: '/home - ', loc: '/home', msg: err }));
                }
            })
            .catch(err => res.render('error', { title: '/home - ', loc: '/home', msg: err }));
        else res.render('error', { title: '/home - ', msg: 'No user ID.. Please sign in' })
    }));

home.get("/booknew", (req, res) =>
    cors(req, res, () => {
        const uid = req.query.uid;
        if (uid) {
            const data: { bid: string, bname: string }[] = [];
            db.collection('business').where('uid', '==', uid).get()
                .then(snaps => {
                    snaps.forEach(doc => data.push({ bid: doc.id, bname: doc.data().bname }));
                    res.render('booknew', { layout: 'mainb', bus: data });
                })
                .catch(err => res.render('error', { id: -1, msg: err }));
        }
        else res.render('error', { id: -1, msg: 'UID missing' })
    }));

exports.home = functions.https.onRequest(home);