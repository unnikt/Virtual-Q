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
    defaultLayout: "main",
    layoutsDir: './views/layouts'
}));
const cors = corsMod({ origin: true });

// This function renders the services collection for a given provide 
services.get('/services', (request, response) =>
    cors(request, response, () => {
        // Get the provider id and create path to services collection
        const pid = (request.query.pid) ? request.query.pid.toString() : "";
        const mode = (request.query.mode) ? request.query.mode.toString() : "";

        if (pid === null) response.send("No pid specified...");
        // Get the providers with matching uid        
        const params: { sid: string, sname: string }[] = [];
        db.collection('providers').doc(pid).collection('services').get()
            .then(svcs => {
                svcs.forEach(svc => params.push({ sid: svc.id, sname: svc.data().sname }));
                if (mode === 'jsn') {
                    response.setHeader('Access-Control-Allow-Origin','*')
                    response.json(params);
                }
                else response.render('services', { svcs: params });
            })
            .catch(err => response.render('error', { title: "Get Services", msg: err }))

    }));


// Add a service to under a provider
// Inputs: pid, doc
services.post('/addservice', (req, res) => {

    cors(req, res, () => {
        console.log(req.body);
        const data = req.body;

        // Get the service to be deleted and create the path to the service
        const pid = data.pid;
        if (data.pid === null) res.send(-1);
        if (data.doc === null) res.send(-2);

        const colPath = "/providers/" + pid + "/services/";

        //Add document to collection
        db.collection(colPath).add(data.doc)
            .then(result => {
                console.log("New service created...");
                res.send(1);
            })
            .catch(err => {
                console.log(err);
                res.send("/addService failed: " + err);
            });
    });
});

services.get('/createsp', (request, response) => response.render('createsp'));
services.get('/vwservices', (request, response) => response.render('vwservices'));

exports.services = functions.https.onRequest(services);