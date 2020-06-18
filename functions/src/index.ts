
import * as main from './main';
import * as home from './home';
import * as settings from './settings';
import * as services from './services';
import * as calendar from './calendar';
import * as store from './dbstore';
import * as events from './events';
    
module.exports = {
    ...main,
    ...home,
    ...settings,
    ...services,
    ...calendar,
    ...store,
    ...events
}