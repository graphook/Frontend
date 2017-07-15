import React, { Component, PropTypes } from 'react';

import s from '../styles/index.scss';

export default class TypeVisualizer extends Component {
  static propTypes = {
    type: PropTypes.object,
  };
  constructor(props) {
    super(props);
    this.state = {
      isClosed: {}
    };
  }
  getRenderMethod = (name) => {
    switch (name) {
      case 'object':
        return this.object;
      case 'array':
        return this.array;
      case 'keyword':
        return this.string;
      case 'text':
        return this.string;
      default:
        return this.other;
    }
  }
  object = (type, path, isRequired) => {
    const pathName = path.join('.');
    let rendering = [
      <tr key={pathName}>
        <td className={s.keyCell}>
          <div className={s.keyCellContainer}>
            {new Array(path.length - 1).fill('').map((val, index) => <div key={index} className={s.spacer} /> )}
            <div className={s.finalSpacer + ' ' + s.dropMenu} onClick={() => {
              this.state.isClosed[pathName] = !this.state.isClosed[pathName];
              this.setState(this.state);
            }}>
              <i className={ 'fa ' + ((this.state.isClosed[pathName]) ? 'fa-chevron-right' : 'fa-chevron-down') } />
            </div>
            <div className={s.keyText}>{path[path.length - 1]}</div>
          </div>
        </td>
        <td>{type.description}</td>
        <td>{type.type}</td>
        <td>{(isRequired) ? 'Yes' : 'No'}</td>
        <td><pre>{JSON.stringify(type.default, null, 2)}</pre></td>
        <td>
          <ul>
            {(() => {
              const properties = [];
              if (type.constant) {
                properties.push(<li key="constant">Must be the value: <pre>{JSON.stringify(type.constant, null, 2)}</pre></li>);
              }
              if (type.allowOtherFields) {
                properties.push(<li key="allowOther">Allows fields other than the ones listed here.</li>);
              }
              if (type.requiresAtLeast) {
                properties.push(
                  <li key="allowOther">
                    Must have at least {type.requiresAtLeast.count} of the following fields:
                    <ul>
                      {type.requiresAtLeast.fields.map((field) => (<li key={field}>{field}</li>))}
                    </ul>
                  </li>
                );
              }
              if (type.cannotHave) {
                properties.push(
                  <li>
                    Cannot have any of the following fields:
                    <ul>
                      {type.cannotHave.map((field) => (<li key={field}>{field}</li>))}
                    </ul>
                  </li>
                );
              }
              return properties;
            })()}
          </ul>
        </td>
      </tr>
    ];
    if (!this.state.isClosed[pathName]) {
      rendering = rendering.concat(Object.keys(type.fields).map((fieldKey) => {
        return this.getRenderMethod(type.fields[fieldKey].type)(type.fields[fieldKey], path.concat(fieldKey), (type.requires) ? type.requires.indexOf(fieldKey) > -1 : false);
      }));
    }
    return rendering;
  }
  array = (type, path, isRequired) => {
    const pathName = path.join('.');
    let rendering = [
      <tr key={pathName}>
        <td className={s.keyCell}>
          <div className={s.keyCellContainer}>
            {new Array(path.length - 1).fill('').map((val, index) => <div key={index} className={s.spacer} /> )}
            <div className={s.finalSpacer + ' ' + s.dropMenu} onClick={() => {
              this.state.isClosed[pathName] = !this.state.isClosed[pathName];
              this.setState(this.state);
            }}>
              <i className={ 'fa ' + ((this.state.isClosed[pathName]) ? 'fa-chevron-right' : 'fa-chevron-down') } />
            </div>
            <div className={s.keyText}>{path[path.length - 1]}</div>
          </div>
        </td>
        <td>{type.description}</td>
        <td>{type.type}</td>
        <td>{(isRequired) ? 'Yes' : 'No'}</td>
        <td><pre>{JSON.stringify(type.default, null, 2)}</pre></td>
        <td>
          <ul>
            {(() => {
              const properties = [];
              if (type.constant) {
                properties.push(<li key="constant">Must be the value: <pre>{JSON.stringify(type.constant, null, 2)}</pre></li>);
              }
              return properties;
            })()}
          </ul>
        </td>
      </tr>
    ];
    if (!this.state.isClosed[pathName]) {
      rendering = rendering.concat(this.getRenderMethod(type.items.type)(type.items, path.concat('[]'), false));
    }
    return rendering;
  }
  string = (type, path, isRequired) => {
    return [
      <tr key={path.join('.')}>
        <td className={s.keyCell}>
          <div className={s.keyCellContainer}>
            {new Array(path.length - 1).fill('').map((val, index) => <div key={index} className={s.spacer} /> )}
            <div className={s.finalSpacer} />
            <div className={s.keyText}>{path[path.length - 1]}</div>
          </div>
        </td>
        <td>{type.description}</td>
        <td>{type.type}</td>
        <td>{(isRequired) ? 'Yes' : 'No'}</td>
        <td><pre>{JSON.stringify(type.default, null, 2)}</pre></td>
        <td>
          <ul>
            {(() => {
              const properties = [];
              if (type.constant) {
                properties.push(<li key="constant">Must be the value: <pre>{JSON.stringify(type.constant, null, 2)}</pre></li>);
              }
              if (type.regex) {
                properties.push(<li key="regex">Must follow the regex: {type.regex}</li>);
              }
              if (type.enums) {
                properties.push(
                  <li key="enums">
                    Must be one of the following values:
                    <ul>
                      {type.enums.map((value) => (<li key={value}><pre>{JSON.stringify(value, null, 2)}</pre></li>))}
                    </ul>
                  </li>
                );
              }
              return properties;
            })()}
          </ul>
        </td>
      </tr>
    ];
  }
  other = (type, path, isRequired) => {
    return [
      <tr key={path.join('.')}>
        <td className={s.keyCell}>
          <div className={s.keyCellContainer}>
            {new Array(path.length - 1).fill('').map((val, index) => <div key={index} className={s.spacer} /> )}
            <div className={s.finalSpacer} />
            <div className={s.keyText}>{path[path.length - 1]}</div>
          </div>
        </td>
        <td>{type.description}</td>
        <td>{type.type}</td>
        <td>{(isRequired) ? 'Yes' : 'No'}</td>
        <td><pre>{JSON.stringify(type.default, null, 2)}</pre></td>
        <td>
          <ul>
            {(() => {
              const properties = [];
              if (type.constant) {
                properties.push(<li key="constant">Must be the value: <pre>{JSON.stringify(type.constant, null, 2)}</pre></li>);
              }
              return properties;
            })()}
          </ul>
        </td>
      </tr>
    ];
  }
  render() {
    return (
      <table className={s.typeVisualizer}>
        <thead>
          <tr>
            <td>Key</td>
            <td>Description</td>
            <td>Type</td>
            <td>Required</td>
            <td>Default</td>
            <td>Other Properties</td>
          </tr>
        </thead>
        <tbody>
          {this.getRenderMethod(this.props.type.properties.type)(this.props.type.properties, [this.props.type.title], true)}
        </tbody>
      </table>
    );
  }
}
