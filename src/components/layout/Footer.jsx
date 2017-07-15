import React, {Component} from 'react';
import {browserHistory} from 'react-router';

import s from '../styles/index.scss';

export default class Footer extends Component {
  render() {
    return (
      <footer>
        <button className={s.primary} onClick={() => browserHistory.push('/contact')}>Contact / Feedback</button>
      </footer>
    )
  }
}