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
export default class IntroAuth extends Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
    user: PropTypes.object
  }
  render() {
    return (
      <div>
        <p>Welcome to Zenow, the platform for creating and sharing data.</p>
        <p>The primary way to interact with information on Zenow is through http requests to our RESTful API (Application Programming Interface). Integrating your project can be done in just a few steps.</p>

        <SectionHeader name="Get Your Developer Account">Get your developer account</SectionHeader>
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


        <SectionHeader name="Understanding HTTP Requests">Understanding HTTP Requests</SectionHeader>
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

        <SectionHeader name="Understanding JSON">Understanding JSON</SectionHeader>
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

        <SectionHeader name="Using Zenow’s Request Tool">Using Zenow’s Request Tool</SectionHeader>
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
      </div>
    );
  }
}
