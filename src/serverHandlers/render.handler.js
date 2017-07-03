import { match } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import { ReduxAsyncConnect, loadOnServer } from 'redux-async-connect';
import createHistory from 'react-router/lib/createMemoryHistory';
import {Provider} from 'react-redux';
import getRoutes from '../routes';
import ApiClient from '../helpers/ApiClient';
import React from 'react';
import ReactDOM from 'react-dom/server';
import createStore from '../redux/create';
import Html from '../helpers/Html';
import WithStylesContext from '../helpers/WithStylesContext.jsx'

export default function(req, res) {
  req.clientSession.secret = process.env.SESSION_SECRET;
  if (process.env.ENV !== 'prod' && process.env.AUTO_TOKEN) {
    req.clientSession.token = process.env.AUTO_TOKEN,
    req.clientSession.user = {
      username: process.env.AUTO_USERNAME,
      email: process.env.AUTO_EMAIL,
      key: process.env.AUTO_KEY
    }
  }

  if (process.env.NODE_ENV === 'development') {
    // Do not cache webpack stats: the script file would change since
    // hot module replacement is enabled in the development env
    webpackIsomorphicTools.refresh();
  }

  let data = {};
  if (req.clientSession.token && req.clientSession.user) {
    data.auth = {
      user: req.clientSession.user
    }
  }

  const client = new ApiClient(req);
  const memoryHistory = createHistory(req.originalUrl);
  const store = createStore(memoryHistory, client, data);
  const history = syncHistoryWithStore(memoryHistory, store);

  function hydrateOnClient() {
    res.send('<!doctype html>\n' +
      ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} store={store}/>));
  }

  if (__DISABLE_SSR__) {
    hydrateOnClient();
    return;
  }

  match({ history, routes: getRoutes(store), location: req.originalUrl }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      res.redirect(redirectLocation.pathname + redirectLocation.search);
    } else if (error) {
      console.error('ROUTER ERROR:', pretty.render(error));
      res.status(500);
      hydrateOnClient();
    } else if (renderProps) {
      loadOnServer({...renderProps, store, helpers: {client}}).then(() => {
        const component = (
          <Provider store={store} key="provider">
            <ReduxAsyncConnect {...renderProps} />
          </Provider>
        );
        res.status(200);
        global.navigator = {userAgent: req.headers['user-agent']};
        res.send('<!doctype html>\n' +
          ReactDOM.renderToString(<Html assets={webpackIsomorphicTools.assets()} component={component} store={store} />));
      });
    } else {
      res.status(404).send('Not found');
    }
  });
}
