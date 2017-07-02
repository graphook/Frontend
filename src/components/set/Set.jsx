import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-async-connect';
import { connect } from 'react-redux';
import { fetchSet } from 'redux/modules/setDetails';
import Helmet from 'react-helmet';
import {Link} from 'react-router';
import {promptSignIn} from 'redux/modules/modal';
import {star, unstar, fetchUser} from 'redux/modules/profileDetails';

import s from '../styles/index.scss';

@asyncConnect([{
  promise: ({store: {dispatch, getState}, params: {id}}) => {
    const promises = [];
    promises.push(dispatch(fetchSet(id)))
    return Promise.all(promises);
  }
}])
@connect(state => {
  const props = {};
  if (state.setDetails.id && state.object.set_type && state.object.set_type[state.setDetails.id]) {
    props.set = state.object.set_type[state.setDetails.id]
  }
  return props;
}, {star, unstar, promptSignIn})
export default class Set extends Component {
  static propTypes = {
    set: PropTypes.object,
    location: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.state = {
      tableFocus: false,
      horizontalScrollOffset: 0
    };
  }
  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);
  }
  handleScroll = () => {
    if (this.state.horizontalScrollOffset !== this.node.scrollLeft) {
      this.setState({horizontalScrollOffset: this.node.scrollLeft});
    }
  }
  render() {
    if (this.props.set) {
      return (
        <div className={s.set} onScroll={this.handleScroll}>
          <Helmet title={this.props.set.title} />
          <div className={s.infoArea} style={{marginLeft: this.state.horizontalScrollOffset}}>
            <div className={s.setInfo}>
              <div>
                <h1>{this.props.set.title} ({this.props.set._id})</h1>
                <p>{this.props.set.description}</p>
              </div>
              <nav>
                <span>
                  <i className="fa fa-user"></i>{this.props.set.creator.username}
                </span>
                <Link to={'/type/' + this.props.set.type._id}>
                  <i className="fa fa-file-text"></i>{this.props.set.type.title}
                </Link>
                <span>
                  <i className="fa fa-file"></i> {this.props.set.numItems}
                </span>
                {!this.props.isStarred && (
                  <button onClick={() => (this.props.isLoggedIn) ? this.props.star(this.props.set._id) : this.props.promptSignIn() }>
                    <i className="fa fa-star-o"></i>{this.props.set.stars}
                  </button>
                )}
                {this.props.isStarred && (
                  <button onClick={() => this.props.unstar(this.props.set._id)}>
                    <i className="fa fa-star"></i>{this.props.set.stars}
                  </button>
                )}
              </nav>
            </div>
            <nav className={s.dataNav}>
              <ul className={s.tabs}>
                <li className={(!this.props.location.query.view || this.props.location.query.view === 'table') ? s.selected : ''}>
                  <Link
                      to={{
                        pathname: this.props.location.pathname,
                        query: {...this.props.location.query, view: 'table'}
                      }}>
                    <i className="fa fa-table"></i>Table View
                  </Link>
                </li>
                <li className={(this.props.location.query.view === 'json') ? s.selected : ''}>
                  <Link
                      to={{
                        pathname: this.props.location.pathname,
                        query: {...this.props.location.query, view: 'json'}
                      }}>
                    <i className="fa fa-align-right"></i>JSON View
                  </Link>
                </li>
                <li className={(this.props.location.query.view === 'csv') ? s.selected : ''}>
                  <Link
                      to={{
                        pathname: this.props.location.pathname,
                        query: {...this.props.location.query, view: 'csv'}
                      }}>
                    <i className="fa fa-list-alt"></i>CSV View
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )
    }
    return (<div className={s.centeredMessage}>There was a problem loading this page. Try refreshing.</div>);
  }
}
