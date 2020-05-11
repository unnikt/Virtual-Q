import express = require('express');
import hbEngine = require('express-handlebars');
import * as corsMod from 'cors';
import * as functions from 'firebase-functions';

const main = express();
const cors = corsMod({ origin: true });

//Set up view engine
main.engine('hbs', hbEngine({
        extname: 'hbs',
        defaultLayout: "main", layoutsDir: './views/layouts/'
}));
main.set('views', './views'); //Set the views folder
main.set('view engine', 'hbs'); //view the engine
main.use(express.json({ limit: '1mb' })); //set up to receive data in JSON format

// return to index 
main.get('/', (request, response) => cors(request, response, () => response.render('index')));
// This function sign's out the user 
main.get('/signout', (request, response) => cors(request, response, () => response.render('index')));

exports.main = functions.https.onRequest(main);