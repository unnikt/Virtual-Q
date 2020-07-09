import admin = require('firebase-admin');
import functions = require('firebase-functions');
import express = require('express');
import hbEngine = require('express-handlebars');
import corsMod = require('cors');

const resources = express();
const db = admin.firestore();

//Set up view engine
resources.set('views', './views'); //Set the views folder
resources.set('view engine', 'hbs'); //view the engine
resources.use(express.json({ limit: '1mb' })); //set up to receive data in JSON format
resources.engine('hbs', hbEngine({
    extname: 'hbs',
    defaultLayout: "mainb",
    layoutsDir: './views/layouts'
}));
const cors = corsMod({ origin: true });

resources.post('/addResType', (req, res) =>
    cors(req, res, () => {
        const data = req.body; const bid = data.bid; const resType = data.resType;
        if ((bid) && (resType))
            db.collection('business').doc(bid).collection('restypes').doc().set({ rtype: resType })
                .then(snap => res.redirect('/resources.html?bid=' + bid))
                .catch(err => res.json({ code: 0, msg: err }))
        else res.json({ code: -1, msg: 'Missing Data...' });
    }));

resources.post('/delResType', (req, res) =>
    cors(req, res, () => {
        const data = req.body; const bid = data.bid; const tid = data.tid;
        if ((bid) && (tid))
            db.collection('business').doc(bid).collection('restypes').doc(tid).delete()
                .then(snap => res.redirect('/resources.html?bid=' + bid))
                .catch(err => res.json({ code: 0, msg: err }))
        else res.json({ code: -1, msg: 'Missing Data...' });
    }));

resources.get('/getResTypes', (request, response) =>
    cors(request, response, () => {
        const bid = (request.query.bid) ? request.query.bid.toString() : "";
        if (bid) {
            const payload: { tid: string, rtype: string }[] = [];
            db.collection('business').doc(bid).collection('restypes').get()
                .then(snaps => {
                    snaps.forEach(doc => payload.push({ tid: doc.id, rtype: doc.data().rtype }));
                    response.json(payload);
                })
                .catch(err => response.json({ title: "Get resTypes - ", err: err }))
        }
        else response.json({ title: "Get resTypes - ", err: 'No bid received' });
    }));

resources.post('/addResource', (req, res) =>
    cors(req, res, () => {
        const data = req.body; const bid = data.bid;
        const resource = { rcode: data.code, rname: data.name, rtype: data.type };
        if ((bid) && (resource))
            db.collection('business').doc(bid).collection('resources').doc().set(resource)
                .then(snap => res.redirect('/resources.html?bid=' + bid))
                .catch(err => res.json({ code: 0, msg: err }))
        else res.json({ code: -1, msg: 'Missing Data...' });
    }));

resources.get('/getResources', (request, response) =>
    cors(request, response, () => {
        const bid = (request.query.bid) ? request.query.bid.toString() : "";
        if (bid) {
            const payload: { rid: string, rcode:string, rname: string, rtype: string }[] = [];
            db.collection('business').doc(bid).collection('resources').get()
                .then(snaps => {
                    snaps.forEach(doc => payload.push({ rid: doc.id,rcode:doc.data().rcode, rname: doc.data().rname, rtype: doc.data().rtype }));
                    response.json(payload);
                })
                .catch(err => response.json({ title: "Get resTypes - ", err: err }))
        }
        else response.json({ title: "Get resTypes - ", err: 'No bid received' });
    }));

resources.post('/delResource', (req, res) =>
    cors(req, res, () => {
        const data = req.body; const bid = data.bid; const rid = data.rid;
        if ((bid) && (rid))
            db.collection('business').doc(bid).collection('resources').doc(rid).delete()
                .then(snap => res.redirect('/resources.html?bid=' + bid))
                .catch(err => res.json({ code: 0, msg: err }))
        else res.json({ code: -1, msg: 'Missing Data...' });
    }));

exports.resources = functions.https.onRequest(resources);