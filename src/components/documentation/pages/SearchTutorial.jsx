import React from 'react';
import RequestTool from '../RequestTool.jsx';
import SectionHeader from '../SectionHeader.jsx';
import { Link } from 'react-router';
import data from './tutorialData.js';

export default () => {
  return (
    <div>
      <SectionHeader name="Simple Search">Simple Search</SectionHeader>
      <p>One of the simplest ways to search on Zenow is by simply providing a string value via the "query" paramerter, which looks for all objects that contain that word or number.</p>
      <p>Search requests for objects, types, sets, and items all support the same functionality, but for the purposes of these examples, we'll be searching among items in the a set of cartoon families: <code>/v2/set//item/search</code></p>

      <SectionHeader name="Advanced Search">Advanced Search</SectionHeader>
    </div>
  )
}