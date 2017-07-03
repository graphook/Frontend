import React, { Component, PropTypes } from 'react';
import { promptSignIn } from 'redux/modules/modal';
import { connect } from 'react-redux';
import {jsonToCsv} from 'utils/csvConverter';

import s from '../styles/index.scss';

@connect(() => ({}), { promptSignIn })
export default class JSONDisplay extends Component {
  static propTypes = {
    data: PropTypes.array,
    isLoggedIn: PropTypes.bool,
    set: PropTypes.object,
    promptSignIn: PropTypes.func
  }
  render() {
    const formattedData = jsonToCsv(this.props.data.map((item) => {
      const newItem = { ...item };
      delete newItem._sets;
      delete newItem._type;
      return newItem;
    }));
    return (
      <div className={s.jsonArea}>
        {(() => {
          if (this.props.isLoggedIn) {
            return (
              <a
                  href={'data:text/plain;charset=utf-8,' + encodeURIComponent(formattedData)}
                  download={this.props.set.title + '.json'}>
                <i className="fa fa-download"></i>download
              </a>
            );
          }
          return (
            <a onClick={this.props.promptSignIn}>
              <i className="fa fa-download"></i>download
            </a>
          );
        })()}
        <pre>
          {formattedData}
        </pre>
      </div>
    );
  }
}
