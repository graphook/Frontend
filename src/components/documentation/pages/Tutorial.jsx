import React, {Component, PropTypes} from 'react';
import SectionHeader from '../SectionHeader.jsx';
import {Link} from 'react-router';
import RequestTool from '../RequestTool.jsx';
import { connect } from 'react-redux';
import CreateUserForm from 'components/login/CreateUserForm.jsx';
import data from './tutorialData.js';

import s from 'components/styles/index.scss';

@connect(state => ({
  isLoggedIn: !!(state.auth.user),
  user: state.profileDetails.user
}))
export default class Tutorial extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
    user: PropTypes.object
  }
  render() {
    return (
      <div id="containerThing" className={s.containerThing}>
        <p>Welcome to Zenow, the platform for creating and sharing data.</p>
        <p>The primary way to interact with information on Zenow is through http requests to our RESTful API (Application Programming Interface). Integrating your project can be done in just a few steps.</p>

        <SectionHeader name="getAccount">Get your developer account</SectionHeader>
        {(() => {
          if (this.props.isLoggedIn) {
            return [
              <p key="pin">Each user is provided with a unique API Key. Yours is <code>{this.props.user.key}</code>. This key allows you make requests to Zenow. You can find your API Key by going to the "profile" page.</p>,
              <img key="imgin" src="/images/apiKeyDirections.png" />
            ];
          }
          return [
            <p key="pout">Before using the Zenow API you need a developer account to get an API Key.</p>,
            <div key="divout" className={s.smallFormContainer + ' ' + s.clickableShadow}>
              <CreateUserForm />
            </div>
          ];
        })()}


        <SectionHeader name="httpRequests">Understanding HTTP Requests</SectionHeader>
        <p>HTTP (Hypertext Transfer Protocol) is one of the most popular standards for sending messages between computers on the internet. It’s what allows you to send requests to Zenow and receive information from it.</p>
        <p>There is a large variety of libraries to help you make an HTTP request. A few are listed below. Choose the library that best fits your project.</p>
        <ul>
          <li>NodeJS: <a href="https://github.com/visionmedia/superagent" target="_blank">SuperAgent</a>, <a href="https://nodejs.org/api/http.html" target="_blank">Native HTTP (less recommended)</a></li>
          <li>PHP: <a href="http://php.net/manual/en/function.stream-context-create.php" target="_blank">stream context create</a></li>
          <li>Ruby on Rails: <a href="https://github.com/httprb/http" target="_blank">HTTP Gem</a>, <a href="http://ruby-doc.org/stdlib-2.4.0/libdoc/net/http/rdoc/index.html" target="_blank">Native HTTP (less recommended)</a></li>
          <li>ASP.net: <a href="https://msdn.microsoft.com/en-us/library/456dfw4f(v=vs.110).aspx" target="_blank">Web Request</a></li>
          <li>DJango: <a href="http://www.django-rest-framework.org/tutorial/2-requests-and-responses/" target="_blank">DJango REST Framework</a></li>
          <li>Flask: <a href="http://docs.python-requests.org/en/latest/user/quickstart/" target="_blank">Requests Module</a></li>
          <li>Java: <a href="http://docs.oracle.com/javase/7/docs/api/java/net/HttpURLConnection.html" target="_blank">HttpURLConnection</a></li>
        </ul>
        <p>Using HTTP is simple. First you send a <strong>request</strong> to Zenow’s API, and the API will then return a <strong>response</strong>.</p>
        <p>HTTP requests consist of 4 basic components: the Method, the URL, the Headers, and the Body.</p>
        <ul>
          <li>The <strong>Method</strong> defines the purpose of your request. Each request on Zenow can be one of four methods:</li>
          <ul>
            <li><strong>GET</strong>: Request to read some content</li>
            <li><strong>POST</strong>: Request to create some new content</li>
            <li><strong>PUT</strong>: Request to update some content</li>
            <li><strong>DELETE</strong>: Request to remove some content</li>
          </ul>
          <li>The <strong>URL</strong> is defines the location to which you would like to send requests and looks something like this: <code>https://api.zenow.io/v1/set/search?count=10&page=0</code>. This URL is split into 4 sections</li>
          <ul>
            <li><code>https://</code> This is the <strong>protocol</strong>. All Zenow requests use the HTTPS protocol, which is a variation of HTTP with additional security.</li>
            <li><code>/v1/set/search</code> This is the <strong>path</strong>. It defines the location to which you want to send your request within Zenow’s API.</li>
            <li><code>?count=10&page=0</code> These are the <strong>parameters</strong>. They help define special information about the request and are always placed at the end of the URL. The parameter section is preceded by a question mark and all parameters are separated by an ampersand.</li>
          </ul>
          <li>The <strong>Headers</strong> are a collection of meta-data that describe the request itself. Though, Zenow doesn’t require any special headers.</li>
          <li>The <strong>Body</strong> is a collection of data that you wish to send to the server. On Zenow, Bodies are only used in POST and PUT requests as these are the requests that entail you sending content to Zenow. All bodies on Zenow are in the JSON (Javascrpt Object Notation) format which is discussed in the next section.</li>
        </ul>
        <p>HTTP responses consist of 3 basic components: the Status, the Response Headers, and the Response Body.</p>
        <ul>
          <li>The <strong>Status</strong> is a numerical code describing how the request went. You can see all possible status codes here (https://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html). Below are some common codes you’ll encounter on Zenow. Don’t worry about memorizing these. The response body usually has enough information to help you figure out what’s going on.</li>
          <ul>
            <li>2XX: Everything’s good! Your request was processed correctly.</li>
            <ul>
              <li>200: General OK</li>
              <li>201: The item was created</li>
            </ul>
            <li>4XX: There was some problem with your request. You might want to consider changing it.</li>
            <ul>
              <li>400: General Problem</li>
              <li>401: You are not authenticated properly. Make sure your API Key is good.</li>
              <li>403: You are authenticated, but your request isn’t proper for your user account.</li>
              <li>404: The resource you’re looking for doesn’t exist.</li>
            </ul>
            <li>5XX: The server has encountered an error. That’s on me. If you keep getting this, please <Link to="/contact">contact me</Link> so that I can fix it.</li>
          </ul>
          <li>The <strong>Response Headers</strong> like the request headers provide metadata for the response.</li>
          <li>The <strong>Response Body</strong> provides you with the information you requested. All response bodies are in JSON which is discussed in the next section.</li>
        </ul>

        <SectionHeader name="json">Understanding JSON</SectionHeader>
        <p>All HTTP request and response bodies (discussed in the previous section) on Zenow are formatted in JSON (JavaScript Object Notation). This is a logical way to represent data as a string of characters, and looks something like this:</p>
        <pre>{JSON.stringify({
          'surname': 'Neutron',
          'people': [
            {
              'firstName': 'Jimmy',
              'age': 12,
              'isParent': false
            },
            {
              'firstName': 'Hugh',
              'age': 40,
              'isParent': true
            },
            {
              'firstName': 'Judy',
              'age': 40,
              'isParent': true
            }
          ],
          'lives': [
            'Retroville'
          ]
        }, null, 2)}</pre>
        <p>JSON consists of various types of information which may or may not contain more types of information. These types are as follows:</p>
        <ul>
          <li><strong>Object</strong>: Objects are denoted by curly brackets <code>{}</code>. Inside these curly brackets are various <strong>keys</strong> which are strings that correspond with <strong>values</strong>. A value can be any of the JSON types. For example in <code>{JSON.stringify({ surname: 'Neutron', people: [] })}</code> the key "surname" corresponds to the string "Neutron" while the key "people" corresponds with an empty array. Note that keys are surrounded by quotes, keys and values are separated by colons, and there is a comma separating each key-value pair.</li>
          <li><strong>Array</strong>: Arrays are denoted by brackets <code>[]</code>. Inside these brackets is an ordered list of any number of JSON types. For example the array <code>["Jimmy", true, {}]</code> contains 3 ordered items: first, the string "Jimmy," second, the boolean "true," and third, an empty array. Note that all items in the array are separated by a comma.</li>
          <li><strong>String</strong>: Strings are a collection of characters usually used to create words or sentences. Example: <code>"Neutro"</code>. Note that strings are surrounded by quotes.</li>
          <li><strong>Number</strong>: Numbers are… well numbers. Examples: <code>12</code>, <code>3.1415</code>. Note that numbers should only contain numbers or a decimal point in the case that it’s a decimal.</li>
          <li><strong>Boolean</strong>: Booleans indicate a binary condition and are written in one of two ways: <code>true</code>, <code>false</code></li>
        </ul>

        <SectionHeader name="requestTool">Using Zenow’s Request Tool</SectionHeader>
        <p>This documentation comes with a tool to demonstrate how each request functions. It’s various components are outlined below.</p>
        <img src="/images/requestToolDiagram.png" />
        <ol>
          <li>Method</li>
          <li>URL</li>
          <li>Send Button (Press to send a request)</li>
          <li>Request Body</li>
          <li>Response Status</li>
          <li>Response Body (Initially the response body will be an anticipated result. You can run the request again to see the actual result)</li>
        </ol>

        <SectionHeader name="getSet">Get a Set</SectionHeader>
        <p>Now that we understand the method by which requests are made, we can start making requests to interact with Zenow.</p>
        <p>For the following sections in this tutorial, we’ll be using data about some cartoon families.</p>
        <p>On Zenow, data is arranged into sets of items. Each set has a unique Id which you can can look up the Id on the <Link to="/set/58895a32ac72909f9a496314">set details page</Link>.</p>
        <img src="/images/detailPageId.png" />
        <p>In order to request the metadata about this set we’ll use the path <code>/v1/set/SET’S_ID.</code></p>
        <RequestTool {...data.getSet.request} />

        <SectionHeader name="getItems">Get Items in a Set</SectionHeader>
        <p>We’ve been able to receive metadata about the set, but Zenow’s real power comes from getting the set’s actual data. Each set represents a collection of items. To get these items we can request the path <code>/v1/set/SET’S_ID/item?count=10&page=0</code></p>
        <p>Notice that this request has parameters. <code>count</code> represents the number of items you want to receive from your request, and <code>page</code> is the page of items based on your count. For example, if there are 20 items in a set and you send a request with <code>count=10&page=1</code>, you will receive the 11th through 20th item.</p>
        <RequestTool {...data.getItems.request} />

        <SectionHeader name="searchItems">Search Items in a Set</SectionHeader>
        <p>Sometimes you want to find specific items within a set based on parameters. To do this, we can <code>POST</code> a search request and pass our search query through the request body.</p>
        <p>In the example below, we’re looking for all the cartoon families with the surname "Turner"</p>
        <RequestTool {...data.searchItems.request} />
        <p>This is just one example. For more complex search queries, see the (Advanced Search documentation).</p>

        <SectionHeader name="createSet">Create your own Set</SectionHeader>
        <p>Before creating a set, we must choose a <strong>type</strong>. Types define the format for every item in the set. Our set of cartoon families will use the (family type) which has the id //insert id//</p>
        <RequestTool {...data.createSet.request} />
        <p>Our request body contains a few fields:</p>
        <ul>
          <li>Title: the title of your set</li>
          <li>Description: the description of your set</li>
          <li>Tags: an array of strings that describe your set. These are useful to help people searching on Zenow find your set.</li>
          <li>Type: the id of the type this set will follow</li>
          <li>Items: an array of items in the set. You can define these items the same way you define them in the "Add Items to a Set" section below.</li>
        </ul>

        <SectionHeader name="addItems">Add Items to a Set</SectionHeader>
        <p>Items can be added to the set by posting to <code>/v1/set/SET’S_ID/item</code></p>
        <RequestTool {...data.addItems.request} />
        <p>Note that this request accepts an array that contains both JSON objects that follow the set’s type and strings. These strings are the ids of items in other sets the follow the same type.</p>

        <SectionHeader name="otherSet">Other Set Operations</SectionHeader>
        <p>See the REST API documentation for more useful set operations:</p>
        <ul>
          <li><Link to="/documentation/Set/updateSet">Update a Set</Link></li>
          <li><Link to="/documentation/Set/deleteSet">Delete a Set</Link></li>
          <li><Link to="/documentation/Set/getItem">Retrieve a Specific Item in a set</Link></li>
          <li><Link to="/documentation/Set/deleteItem">Remove an Item from a Set</Link></li>
        </ul>

        <SectionHeader name="createType">Create a Type</SectionHeader>
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
    );
  }
}
