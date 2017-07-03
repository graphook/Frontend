import React, {Component, PropTypes} from 'react';
import types from './type.map.js';
import NtNull from './NtNull.jsx';

import s from 'components/styles/index.scss';

class NtObject extends Component {
  static propTypes = {
    type: PropTypes.object,
    data: PropTypes.object,
    path: PropTypes.array
  }
  render() {
    return (
      <div className={s.ntObject}>
        {Object.keys(this.props.type.fields).map((propKey) => {
          const ChildComponent = types[this.props.type.fields[propKey].type];
          const tempPath = this.props.path.slice(0);
          tempPath.push(propKey);
          if (this.props.data[propKey] != null) {
            return (
              <ChildComponent
                  key={tempPath.join()}
                  type={this.props.type.fields[propKey]}
                  data={this.props.data[propKey]}
                  path={tempPath} />
              );
          }
          return (
            <NtNull key={tempPath.join()} />
          );
        })}
      </div>
    );
  }
}

module.exports = NtObject;
