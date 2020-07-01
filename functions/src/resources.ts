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
        console.log(req.body);
        const data = req.body; const bid = data.bid; const resType = data.resType;
        if ((bid) && (resType))
            db.collection('resources/' + bid + "/types").add(resType)
                .then(snap => res.redirect('/resources.htmls?bid=' + bid))
                .catch(err => res.json({ code: 0, msg: err }))
        else res.json({ code: -1, msg: 'Missing Data...' });
    }));

// // This function renders the services collection for a given provide 
// resources.get('/services', (request, response) =>
//     cors(request, response, () => {
//         // Get the provider id and create path to services collection
//         const bid = (request.query.bid) ? request.query.bid.toString() : "";
//         const mode = (request.query.mode) ? request.query.mode.toString() : "";
//         if ((bid === null) || (bid === "")) response.send("No bid specified...");
//         else {
//             // Get the providers with matching uid        
//             const params: { sid: string, sname: string }[] = [];
//             db.collection('business').doc(bid).collection('services').get()
//                 .then(svcs => {
//                     svcs.forEach(svc => params.push({ sid: svc.id, sname: svc.data().sname }));
//                     if (mode === 'jsn') {
//                         response.setHeader('Access-Control-Allow-Origin', '*')
//                         response.json(params);
//                     }
//                     else response.render('services', { svcs: params });
//                 })
//                 .catch(err => response.render('error', { title: "Get Services", msg: err }))
//         }
//     }));



// resources.post('findResources', (req, res) =>
//     cors(req, res, () => {
//         const data = req.body;
//         console.log(data);
//         //1. Get resources for the SID
//         //2. Search resource table for availability
//     }));

// resources.get('/createsp', (request, response) => response.render('createsp'));
// resources.get('/vwservices', (req, res) =>
//     cors(req, res, () => {
//         const bid = req.query.bid;
//         const svcs: { sid: string, sname: string }[] = [];
//         if (bid) db.collection('business/' + bid + '/services').get()
//             .then(snaps => {
//                 snaps.forEach(doc => svcs.push({ sid: doc.id, sname: doc.data().sname }));
//                 res.render('vwservices', { bid: bid, svcs: svcs })
//             })
//             .catch(err => res.render('error', { title: 'vwservices', msg: err }))
//     }));

exports.services = functions.https.onRequest(resources);