import React, { Component, PropTypes } from 'react';
import { promptSignIn } from 'redux/modules/modal';
import { connect } from 'react-redux';

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
    const formattedData = JSON.stringify(this.props.data, null, 2);
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
