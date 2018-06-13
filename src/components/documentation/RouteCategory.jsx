import React, {Component, PropTypes} from 'react';
import SectionHeader from './SectionHeader.jsx';
import RequestTool from './RequestTool.jsx';
import TypeVisualizer from 'components/type/TypeVisualizer.jsx';

import s from 'components/styles/index.scss';

export default class RouteCategory extends Component {
  static propTypes = {

  }
  render() {
    return (
      <div>
        <h1>{this.props.category.category}</h1>
        {this.props.category.routes.map((route) => {
          let elements = [
            <SectionHeader name={route.method + route.path.replace(new RegExp('/', 'g'), ' ')} >
              <span className={s.method}>{route.method}</span> {route.path}
            </SectionHeader>,
            <p>{route.description}</p>,
          ];
          if (route.notes) {
            elements.push(<ul>
              {route.notes.map((note) => {
                return <li>{note}</li>
              })}
            </ul>);
          }
          const headers = route.headers;
          if (headers && Object.keys(headers.fields).length > 0) {
            elements.push(<h3>Headers</h3>);
            elements.push(
              <div className={s.typeVisContainer}>
                <TypeVisualizer type={{
                  title: 'Headers',
                  properties: headers
                }} />
              </div>
            );
          }
          const parameters = route.parameters;
          if (parameters && Object.keys(parameters.fields).length > 0) {
            elements.push(<h3>URL Parameters</h3>);
            elements.push(
              <div className={s.typeVisContainer}>
                <TypeVisualizer type={{
                  title: 'URL Parameters',
                  properties: parameters
                }} />
              </div>
            );
          }
          const body = route.category.body;
          if (body && Object.keys(body.fields).length > 0) {
            elements.push(<h3>Request Body</h3>);
            elements.push(
              <div className={s.typeVisContainer}>
                <TypeVisualizer type={{
                  title: 'Request Body',
                  properties: body
                }} />
              </div>
            );
          }
          // toRender.push(<RequestTool {...this.props.request} />);
          return elements;
        })}
      </div>
    )
  }
}