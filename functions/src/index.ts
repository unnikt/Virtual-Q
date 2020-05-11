
import * as main from './main';
import * as settings from './settings';
import * as services from './services';
import * as skedules from './skedules';
import * as store from './dbstore';
    
module.exports = {
    ...main,
    ...settings,
    ...services,
    ...skedules,
    ...store
}