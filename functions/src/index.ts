
//Initialise firebaseapp
import * as functions from 'firebase-functions';
import admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

import * as home from './home';
import * as settings from './settings';
import * as business from './business';
import * as services from './services';
import * as resources from './resources';
import * as calendar from './calendar';
import * as store from './dbstore';
import * as events from './events';



module.exports = {
    ...home,
    ...settings,
    ...business,
    ...services,
    ...resources,
    ...calendar,
    ...store,
    ...events
}