
import * as services from './services';
import * as skedules from './skedules';
import * as main from './main';
import * as store from './dbstore';
import * as settings from './settings';
    
module.exports = {
    ...main,
    ...settings,
    ...services,
    ...skedules,
    ...store
}