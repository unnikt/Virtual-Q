
import * as services from './services';
import * as skedules from './skedules';
import * as main from './main';
import * as store from './dbstore';

module.exports = {
    ...services,
    ...skedules,
    ...main,
    ...store
}