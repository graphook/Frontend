import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-async-connect';
import { connect } from 'react-redux';
import { fetchSet } from 'redux/modules/setDetails';
import { fetch } from 'redux/modules/object';
import Helmet from 'react-helmet';
import {Link} from 'react-router';
import {promptSignIn} from 'redux/modules/modal';
import {star, unstar, fetchUser} from 'redux/modules/profileDetails';
import ReactDOM from 'react-dom';
import NestingTable from './nestingTable/NestingTable.jsx';
import {updateSearchText} from 'redux/modules/searchInput';
import {search} from 'redux/modules/searchResults';
import Waypoint from 'react-waypoint';
import {browserHistory} from 'react-router';

import s from '../styles/index.scss';

@asyncConnect([{
  promise: ({location, params, store: {dispatch, getState}, params: {id}}) => {
    const query = location.query.sq;
    const setName = params.id;
    const oldSetName = getState().setDetails.id;
    const promises = [];
    promises.push(dispatch(fetchSet(id)).then(() => {
      const state = getState();
      const set = state.object.set_type[state.setDetails.id];
      const nestedPromises = [];
      if (!(state.object.type_type && state.object.type_type[set.type._id])) {
        nestedPromises.push(dispatch(fetch(set.type._id)))
      }
      if (query !== state.setResults.curSearch || !state.setResults.loaded) {
        nestedPromises.push(dispatch(search(query || '', 0, setName, 'setResults', oldSetName !== set._id)));
      }
      if (__SERVER__) {
        return Promise.all(nestedPromises);
      }
      Promise.all(nestedPromises);
    }));
    promises.push(dispatch(fetchUser()));
    promises.push(dispatch(updateSearchText(query || '', 'setSearchBar')));
    return Promise.all(promises);
  }
}])
@connect((state) => {
  const props = {
    isStarred: (state.profileDetails.user.stars) ? state.profileDetails.user.stars.indexOf(state.setDetails.id) !== -1 : false,
    isLoggedIn: !!(state.auth.user),
    results: [],
    loadingResults: state.setResults.loading,
    curSearch: state.setResults.curSearch,
    searchText: state.setSearchBar.searchText
  };
  if (state.setDetails.id &&
      state.object.set_type &&
      state.object.set_type[state.setDetails.id]) {
    props.set = state.object.set_type[state.setDetails.id]
    props.results = state.setResults.results.map((result) => {
      return state.object[props.set.type._id][result]
    });
    if (state.object.type_type && state.object.type_type[props.set.type._id]) {
      props.type = state.object.type_type[props.set.type._id];
    }
  }
  return props;
}, {star, unstar, promptSignIn, updateSearchText})
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
                  <i className="fa fa-file"></i> {this.props.set.numberOfItems}
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
              <form className={s.searchBox} onSubmit={(e) => {
                e.preventDefault();
                browserHistory.push('/set/' + this.props.set._id + '?sq=' + this.props.searchText);
              }}>
                <input
                    type="text"
                    placeholder="Search Objects in this Set"
                    ref="searchBox"
                    value={this.props.searchText}
                    onChange={(e) => this.props.updateSearchText(e.target.value, 'setSearchBar')} />
                <button className={s.primary}><i className="fa fa-search"></i></button>
              </form>
            </nav>
          </div>
          <Waypoint
            onEnter={() => this.setState({focusTable: false})}
            onLeave={() => this.setState({focusTable: true})} />
          <pre>
            {JSON.stringify(this.props.results, null, 2)}
          </pre>
          {/*<NestingTable
            type={this.props.type}
            data={data}
            focused={this.state.focusTable}
            horizontalScrollOffset={this.state.horizontalScrollOffset} /> */}
        </div>
      )
    }
    return (<div className={s.centeredMessage}>There was a problem loading this page. Try refreshing.</div>);
  }
}
