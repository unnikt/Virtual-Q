// import firebase = require('firebase-admin');
import functions = require('firebase-functions');
import corsMod = require('cors');

import express = require('express');
import vwengine = require('express-handlebars');

//Set up view engine
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
        const params = req.body;
        console.log(params);
        console.log("/getevents");
        const data = {
            events: [{ aid: "asajjjjssss", date: '12', start: '09:00 AM', end: '10:00 AM', bname: 'Curtis Av', sname: 'PPL Training' },
            { aid: "asajjjjssss", date: '12', start: '10:15 AM', end: '11:00 AM', bname: 'Curtis Av', sname: 'PPL Training' },
            { aid: "asajjjjssss", date: '25', start: '11:00 AM', end: '11:00 AM', bname: 'Curtis Av', sname: 'PPL Training' },
            { aid: "asajjjjssss", date: '29', start: '03:00 PM', end: '11:00 AM', bname: 'Curtis Av', sname: 'PPL Training' }]
        };
        res.json(data);
    }));

exports.events = functions.https.onRequest(events);