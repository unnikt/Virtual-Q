import express = require('express');
import hbEngine = require('express-handlebars');
import * as corsMod from 'cors';
import * as functions from 'firebase-functions';
import admin = require('firebase-admin');

//Initialise firebaseapp
admin.initializeApp(functions.config().firebase);

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
    const uid = "GUV33P1scHeRqbnZF0t4RRjsJ5K2"; // TO DO - Remove UID hard coding
    const params = { business: false };

    // Get Business flag for the user
    const userdoc = db.collection("users").doc(uid);
    userdoc.get()
        .then(snap => {
            const userdata = snap.data()
            if (userdata) params.business = userdata.business;
            response.render("settings", params);
        })
        .catch(err => console.log("/settings (userdoc.get):-" + err))
}));

exports.settings = functions.https.onRequest(settings);