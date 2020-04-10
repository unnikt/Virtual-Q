import express = require('express');
import hbEngine = require('express-handlebars');
import * as functions from 'firebase-functions';
import * as corsMod from 'cors';

const common = express();

//Set up handlebars engine
common.engine('hbs',
    hbEngine({extname:'hbs',defaultLayout:"main",
                layoutsDir:'./views/layouts/'}));              
common.set('views','./views'); //Set the views folder
common.set('view engine','hbs'); // set the view engine
common.use(express.json({limit:'1mb'})); //set up to receive data in JSON format
common.use(express.static(__dirname + '/public'));

const cors = corsMod({origin:true});

common.get('/getskedule', (req,res)=>{
    cors(req,res,()=>{
        res.render('skedules',{ 
            title:'Appointments'
        });
    })
});

exports.common = functions.https.onRequest(common);