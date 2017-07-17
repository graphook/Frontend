import React from 'react';
import RequestTool from '../RequestTool.jsx';
import SectionHeader from '../SectionHeader.jsx';
import { Link } from 'react-router';
import data from './tutorialData.js';

export default () => {
  return (
    <div>
      <SectionHeader name="Create a Type">Create a Type</SectionHeader>
      <p>Often times the types currently available on Zenow won’t fit the type you’d like your set to follow. So, you can create your own types if needed.</p>
      <p>Here we’re making a duplicate of the family type we’ve been using.</p>
      <RequestTool {...data.createType.request} />
      <p>The request body requires various fields:</p>
      <ul>
        <li>Title: the title of the type</li>
        <li>Description: the description of the type</li>
        <li>Tags: an array of strings that describe your type. These are useful to help people searching on Zenow find your type.</li>
        <li>Properties: The definition of the structure for items following this type. Each field includes the kind of type that should go in that field. Note that 'object' types have "properties" field to define more key values and "array" types have an "items" field to define the type of the items in the array.</li>
      </ul>
    </div>
  )
}