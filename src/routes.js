import React from 'react';
import {IndexRoute, Route} from 'react-router';
import Layout from './components/layout/Layout.jsx';

import Search from './components/search/Search.jsx';
import Set from './components/set/Set.jsx';
import SetCreate from './components/set/SetCreate.jsx';
import Type from './components/type/Type.jsx';
import TypeCreate from './components/type/TypeCreate.jsx';
import Profile from './components/profile/Profile.jsx';
import Documentation from './components/documentation/Documentation.jsx';
import Contact from './components/contact/Contact.jsx';

export default () => {
  return (
    <Route path="/" component={Layout}>
      { /* Home (main) route */ }
      <IndexRoute path="" component={Search} />

      { /* Routes */ }
      <Route path="/search" component={Search} />
      <Route path="/search/:setName" component={Search} />
      <Route path="/set/create" component={SetCreate} />
      <Route path="/set/:id" component={Set} />
      <Route path="/type/create" component={TypeCreate} />
      <Route path="/type/:id" component={Type} />
      <Route path="/documentation" component={Documentation} />
      <Route path="/documentation/:topic" component={Documentation} />
      <Route path="/documentation/:topic/:subTopic" component={Documentation} />
      <Route path="/profile" component={Profile} />
      <Route path="/contact" component={Contact} />

      { /* Catch all route */ }
      { /* <Route path="*" component={NotFound} status={404} /> */ }
    </Route>
  );
};
