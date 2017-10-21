import { createStore } from 'redux';
import { combineReducers } from 'redux-immutable';

import unit from './reducer/unit';
// import content from './reducer/content';

let devToolsEnhancer = null;
if (process.env.NODE_ENV === 'development') {
    devToolsEnhancer = require('remote-redux-devtools');
}

const reducers = combineReducers({ unit });
let store = null;
if (devToolsEnhancer) {
    store = createStore(reducers, devToolsEnhancer.default({ realtime: true, port: config.reduxDevPort }));
}
else {
    store = createStore(reducers);
}
export default store;
