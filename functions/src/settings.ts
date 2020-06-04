import express = require('express');
import hbEngine = require('express-handlebars');
import * as corsMod from 'cors';
import * as functions from 'firebase-functions';
import admin = require('firebase-admin');

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
    const params: { isBusiness: boolean, business: { bid: string, bname: string }[] }
        = { isBusiness: false, business: [] };

    // Get Business records for the user if available
    db.collection('providers').where('uid', '==', uid).get()
        .then(qresults => {
            if (qresults) {
                params.isBusiness = true;
                qresults.forEach(business => {
                    params.business.push({ bid: business.id, bname: business.data().orgname })
                })
                response.render('settings', params);
            }
        })
        .catch(err => response.send("/settings:-" + err));
}));

exports.settings = functions.https.onRequest(settings);