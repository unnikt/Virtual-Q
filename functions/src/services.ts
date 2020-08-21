import admin = require('firebase-admin');
import functions = require('firebase-functions');
import express = require('express');
import hbEngine = require('express-handlebars');
import corsMod = require('cors');

const services = express();
const db = admin.firestore();

//Set up view engine
services.set('views', './views'); //Set the views folder
services.set('view engine', 'hbs'); //view the engine
services.use(express.json({ limit: '1mb' })); //set up to receive data in JSON format
services.engine('hbs', hbEngine({
    extname: 'hbs',
    defaultLayout: "mainb",
    layoutsDir: './views/layouts'
}));
const cors = corsMod({ origin: true });

// This function renders the services collection for a given provide 
services.get('/services', (request, response) =>
    cors(request, response, () => {
        // Get the provider id and create path to services collection
        const bid = (request.query.bid) ? request.query.bid.toString() : "";
        const mode = (request.query.mode) ? request.query.mode.toString() : "";
        if ((bid === null) || (bid === "")) response.send("No bid specified...");
        else {
            // Get the providers with matching uid        
            const params: { sid: string, sname: string }[] = [];
            db.collection('business').doc(bid).collection('services').get()
                .then(svcs => {
                    svcs.forEach(svc => params.push({ sid: svc.id, sname: svc.data().sname }));
                    if (mode === 'jsn') {
                        response.setHeader('Access-Control-Allow-Origin', '*')
                        response.json(params);
                    }
                    else response.render('services', { svcs: params });
                })
                .catch(err => response.render('error', { title: "Get Services", msg: err }))
        }
    }));


// Add a service to under a provider
// Inputs: pid, doc
services.post('/addservice', (req, res) => {
    cors(req, res, () => {
        console.log(req.body);
        const data = req.body; const bid = data.bid;
        const svc = { sname: data.sname, sdesc: data.sdesc, price: data.sprice };

        // Get the service to be deleted and create the path to the service
        // const bid = data.pid;
        if ((bid) && (svc))
            db.collection('business/' + bid + "/services").add(svc)
                .then(snap => res.redirect('/vwservices?bid=' + bid))
                .catch(err => res.json({ code: 0, msg: err }))
        else res.json({ code: -1, msg: 'Missing Data...' });
    });
});

services.post('findResources', (req, res) =>
    cors(req, res, () => {
        const data = req.body;
        console.log(data);
        //1. Get resources for the SID
        //2. Search resource table for availability
    }));
services.get('/createsp', (request, response) => response.render('createsp'));
services.get('/vwservices', (req, res) =>
    cors(req, res, () => {
        const bid = req.query.bid;
        const svcs: { sid: string, sname: string }[] = [];
        if (bid) db.collection('business/' + bid + '/services').get()
            .then(snaps => {
                snaps.forEach(doc => svcs.push({ sid: doc.id, sname: doc.data().sname }));
                res.render('vwservices', { bid: bid, svcs: svcs })
            })
            .catch(err => res.render('error', { title: 'vwservices', msg: err }))
    }));

exports.services = functions.https.onRequest(services);