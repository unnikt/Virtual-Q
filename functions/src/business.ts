import admin = require('firebase-admin');
import functions = require('firebase-functions');
import express = require('express');
import hbEngine = require('express-handlebars');
import corsMod = require('cors');

const business = express();
const db = admin.firestore();

//Set up view engine
business.set('views', './views'); //Set the views folder
business.set('view engine', 'hbs'); //view the engine
business.use(express.json({ limit: '1mb' })); //set up to receive data in JSON format
business.engine('hbs', hbEngine({
    extname: 'hbs',
    defaultLayout: "mainb",
    layoutsDir: './views/layouts'
}));
const cors = corsMod({ origin: true });

business.get('/createsp', (request, response) => {
    const uid = request.query.uid;
    (uid) ? response.render('createsp', { uid: uid }) : response.render('error', { code: -1, msg: 'Missing UID...' })
});

business.post("/createBus", (req, res) =>
    cors(req, res, () => {
        const data = req.body;
        const newDoc = { uid: data.uid, bname: data.bname, rego: data.rego, email: data.email, phone: data.phone };
        db.collection('business').add(newDoc)
            .then(docRef => res.redirect('settings?uid=' + data.uid + "&bid=" + docRef.id))
            .catch(err => res.render('error', { code: -1, loc: 'createBus', msg: err }));
    }));

exports.business = functions.https.onRequest(business);