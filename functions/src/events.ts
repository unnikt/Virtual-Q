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
        const end = new Date(inp.year, inp.month+1, 0);
        start.setHours(0, 0, 0);
        end.setHours(23, 59, 59, 59);
        
        // console.log("/getevents");
        const data: { events: { aid: string, start: string, end: string, bname: string, sname: string }[] } = { events: [] };
        if (id && val)
            db.collection('appointments')
                .where(id, '==', val).where('start','>=',start).where('start','<=',end)
                .orderBy('start').get()
                .then(results => {
                    results.forEach(doc => data.events.push({
                        aid: doc.id,
                        start: doc.data().start,
                        end: doc.data().end,
                        bname: doc.data().bid,
                        sname: doc.data().sid
                    }));
                    res.json(data);
                })
                .catch(err => res.render('error', { title: 'getevents', msg: err }));
        else
            res.json(data);
    }));

exports.events = functions.https.onRequest(events);