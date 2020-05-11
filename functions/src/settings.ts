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

    const uid = "GUV33P1scHeRqbnZF0t4RRjsJ5K2";
    const params = { provider: false, orgname: "" }

    // Get the provider doc for the user
    db.collection("providers").doc(uid).get()
        .then(doc => {
            if (doc.exists) {
                params.provider = true;
                params.orgname = doc.get("orgname");
            } 
        })
    .catch (err=>console.log(err))

    response.render("settings", params);
}));

exports.settings = functions.https.onRequest(settings);