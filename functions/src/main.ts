import express = require('express');
import hbEngine = require('express-handlebars');
import * as corsMod from 'cors';
import firebase = require('firebase-admin');
import * as functions from 'firebase-functions';

const main = express();
const cors = corsMod({origin:true});
const db = firebase.firestore();

//Set up view engine
main.engine('hbs', hbEngine({extname:'hbs',
        defaultLayout:"main", layoutsDir:'./views/layouts/'}));
main.set('views','./views'); //Set the views folder
main.set('view engine','hbs'); //view the engine
main.use(express.json({limit:'1mb'})); //set up to receive data in JSON format

// This function sign's out the user 
main.get('/signout', (request, response)=>{
    cors(request,response,()=>{
        // Get the provider id and create path to services collection
        // response.send("main/signout");
            // const hbsParams: { bSignOut: string;} = {bSignOut:"true"};
            response.render('index');
})
});

main.get('/delete',(req,res) =>
cors(req,res,()=>
{   const location = getlocation(req.query.type);
    const docid = req.query.id

    res.set('content-type', 'text/html');
    
    if((!location) || (!docid))
        res.send ("doctype or docid is missing..");

    console.log(location + docid)
    db.doc(location + docid).delete()
    .then(result =>{res.send("Deletion succeeded.")})
    .catch(error =>{res.send("Deletion failed..." + error);})
}));

function getlocation(doctype:string){
    switch(doctype){
        case('appointment'):
            return ('/appointments/');
        case('service'):
            return ('/providers/AUS-SYD-CAM-001/services/');
        case('provider'):
            return ('/providers/');
    }
    return(null);
}

exports.main = functions.https.onRequest(main);