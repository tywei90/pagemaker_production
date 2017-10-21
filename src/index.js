import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

import './index.scss';

import Store from './store';

import App from './components/app';

ReactDom.render(
	<Provider store={Store}>
	    <Router history={browserHistory}>
	        <Route path="/genpages" component={App}>
	            
	        </Route>
	    </Router>
    </Provider>,
    document.querySelector('#app')
);
