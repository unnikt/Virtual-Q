import express = require('express');
import hbEngine = require('express-handlebars');
import * as corsMod from 'cors';
import admin = require('firebase-admin');
import * as functions from 'firebase-functions';

const dbstore = express();
const cors = corsMod({ origin: true });
const db = admin.firestore();

//Set up view engine
dbstore.engine('hbs', hbEngine({
    extname: 'hbs',
    defaultLayout: "main", layoutsDir: './views/layouts/'
}));
dbstore.set('views', './views'); //Set the views folder
dbstore.set('view engine', 'hbs'); //view the engine
dbstore.use(express.json({ limit: '1mb' })); //set up to receive data in JSON format

dbstore.post('/add', (req, res) =>
    cors(req, res, () => {
        const location = getlocation(req.body.type.toString());
        const doc = req.body.doc;
        res.set('content-type', 'text/html');
        //Add document to collection
        admin.firestore().collection(location).add(doc)
            .then(result => res.send("01-Document added successfully"))
            .catch(err => res.send("00-Err:[dbstore.post - /add] " + err));
    }));

dbstore.get('/delete', (req, res) =>
    cors(req, res, () => {
        const location = getlocation(req.query.type.toString());
        const docid = req.query.id;
        res.set('content-type', 'text/html');
        if ((!location) || (!docid))
            res.send("doctype or docid is missing..");
        db.doc(location + docid).delete()
            .then(result => { res.send("Deletion succeeded.") })
            .catch(error => { res.send("Deletion failed..." + error); })
    }));

function getlocation(doctype: string) {
    switch (doctype) {
        case ('appointment'):
            return ("/appointments/");
        case ('service'):
            return ('/services/');
        case ('provider'):
            return ('/providers/');
    }
    return ("");
}

exports.dbstore = functions.https.onRequest(dbstore);

//Create a record in the users collection
exports.registerUser = functions.auth.user().onCreate(user => {
  return admin.firestore().collection('users').doc(user.uid).set({
        email: user.email,
        provider: false,
        pid: ""
    });
})

//Firestore trigger that creates a default walk in service when the user registers as a service provider
exports.createDefaultService = functions.firestore.document('/providers/{doc_id}')
    .onCreate((snap, context) => {
        //Create the default service for the new provider created
        const doc_id = context.params.doc_id;
        const default_Services = {
            sname: 'Walk in',
            desc: 'Default Walk in service'
        }
        return admin.firestore().collection('/providers/' + doc_id + '/services').doc(doc_id).set(default_Services);
    });