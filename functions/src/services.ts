import firebase = require('firebase-admin');
import functions = require('firebase-functions');
// import * as functions from 'firebase-functions';
import express = require('express');
import hbEngine = require('express-handlebars');
import corsMod = require('cors'); 
// import * as corsMod from 'cors';

const services = express();

//Set up view engine
services.set('views','./views'); //Set the views folder
services.set('view engine','hbs'); //view the engine
services.use(express.json({limit:'1mb'})); //set up to receive data in JSON format
services.engine('hbs', hbEngine({extname:'hbs',
        defaultLayout:"main",
        layoutsDir:'./views/layouts'}));
const cors = corsMod({origin:true});

//Initialise firebaseapp
firebase.initializeApp(functions.config().firebase);

// This function returns the services collection for a given provide 
services.get('/services', (request, response)=>{
cors(request,response,()=>{
    // Get the provider id and create path to services collection
    const pid = "AUS-SYD-CAM-001";
    if(pid===null) response.send("No pid specified...");
    const colPath = "/providers/" + pid + "/services";
    // Get the services collection from firestore and store it in an array
    firebase.firestore().collection(colPath).get()
    .then(querysnapshot =>{
        const arrServices: { sid: string; name: string; desc: string; }[] = [];
        querysnapshot.forEach (doc =>{
            arrServices.push({sid:doc.id,name:doc.data().ServiceName,desc:doc.data().ServiceDescription});
        });
        // response.send("update..." + arrSvcs);
        // render the index handlbar
        console.log(arrServices);
        response.render('services',{arrServices:arrServices});

    })
    .catch(error =>{
        response.send(error);
    })
});
});

// This function removes a service under a particular provider 
// Inputs: pid, sid
services.get('/remservice',(request,response)=>{

    // Get the service to be deleted and create the path to the service
    const pid = request.query.pid;
    if(pid===null) response.send("No pid specified...");
    const sid = request.query.sid;
    if(sid===null) response.send("No sid specified...");
    const docPath = "/providers/" + pid + "/services/" + sid;

    // call firestore to delete the service
    firebase.firestore().doc(docPath).delete()
    .then(result =>{
        response.send(docPath + " deleted...")
    })
    .catch(error =>{
        response.send("Error:" + error);
    })
});

// Add a service to under a provider
// Inputs: pid, doc
services.post('/addservice',(request,response)=>{

    cors(request,response,()=>{
        console.log(request.body);
        const data = request.body;

        // Get the service to be deleted and create the path to the service
        const pid = data.pid;
        if(data.pid===null) response.send(-1);
        if(data.doc===null) response.send(-2);

        const colPath = "/providers/" + pid + "/services";
            
        //Add document to collection
        firebase.firestore().collection(colPath).add(data.doc)
        .then(result =>{
            console.log("New service created...");
            response.send(1);
        })
        .catch(err =>{
            console.log(err);
            response.send("/addService failed: " + err);
        });
    });
});

services.get('/editservice',(request,response)=>{
      response.send("updServiceTS");
});

exports.services = functions.https.onRequest(services);