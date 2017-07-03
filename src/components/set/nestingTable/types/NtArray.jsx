import React, {Component, PropTypes} from 'react';
import types from './type.map.js';
import NtNull from './NtNull';

import s from 'components/styles/index.scss';

class NtArray extends Component {
  static propTypes = {
    type: PropTypes.object,
    data: PropTypes.array,
    path: PropTypes.array
  }
  render() {
    const ChildComponent = types[this.props.type.items.type] || NtNull;
    return (
      <div className={s.ntArrayContainer}>
        {this.props.data != null && this.props.data.map((elem, index) => {
          const tempPath = this.props.path.slice(0);
          tempPath.push(index);
          return (
            <div className={s.ntItem} key={tempPath.join()}>
              <ChildComponent
                  type={this.props.type.items}
                  data={elem}
                  path={tempPath} />
            </div>
          );
        })}
      </div>
    );
  }
}

module.exports = NtArray;
