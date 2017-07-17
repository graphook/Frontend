import React from 'react';
import RequestTool from '../RequestTool.jsx';
import SectionHeader from '../SectionHeader.jsx';
import { Link } from 'react-router';
import data from './tutorialData.js';

export default () => {
  return (
    <div>
      <SectionHeader name="Search Items in a Set">Search Items in a Set</SectionHeader>
      <p>Sometimes you want to find specific items within a set based on parameters. To do this, we can <code>POST</code> a search request and pass our search query through the request body.</p>
      <p>In the example below, we’re looking for all the cartoon families with the surname "Turner"</p>
      <RequestTool {...data.searchItems.request} />
      <p>This is just one example. For more complex search queries, see the (Advanced Search documentation).</p>
    </div>
  )
}