import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-async-connect';
import { connect } from 'react-redux';
import {browserHistory} from 'react-router';
import Waypoint from 'react-waypoint';
import {Link} from 'react-router';
import {throttle} from 'lodash';
import Helmet from 'react-helmet';
import {searchSets} from 'redux/modules/search';

import s from '../styles/index.scss';

@asyncConnect([{
  promise: ({ store: {dispatch, getState}}) => {
    const promises = [];
    if (query !== getState()[name].curSearch || !getState().setSearch.loaded) {
      promises.push(dispatch(searchSets(query || '', 0, setName, name)));
    }
    if (__SERVER__) {
      return Promise.all(promises);
    } else {
      Promise.all(promises);
    }
  }
}])
@connect(
  (state, props) => ({
    loading: state[props.name].loading,
    searchResults: state[props.name].results,
    setHash: state[props.name].hash,
    searchText: state[props.name].searchText,
    curSearch: state[props.name].curSearch,
    page: state[props.name].page
  }), {})
export default class SearchResults extends Component {
  static propTypes = {
    searchText: PropTypes.string,
    loading: PropTypes.bool,
    searchSets: PropTypes.func,
    curSearch: PropTypes.string,
    page: PropTypes.number,
    updateSearchText: PropTypes.func,
    searchResults: PropTypes.array,
    setHash: PropTypes.object,
    location: PropTypes.object
  }
  constructor(props) {
    super(props);
    this.searchThrottle = throttle(() => {
      // this.props.searchSets(this.refs.searchBox.value);
    }, 1000);
  }
  search = (e) => {
    e.preventDefault();
    browserHistory.push('/set?q=' + this.props.searchText);
  }
  loadMore = () => {
    if (!this.props.loading) {
      // this.props.searchSets(this.props.curSearch, this.props.page + 1);
    }
  }
  updateSearchText = (e) => {
    // this.props.updateSearchText(e.target.value);
    this.searchThrottle();
  }
  goToSet = (id, e) => {
    if (e.target.tagName !== 'A') {
      browserHistory.push('/set/' + id);
    }
  }
  render() {
    return (
      <section className={s.searchResults}>
        {this.props.searchResults.map((result) => {
          const resultData = this.props.setHash[result];
          return (
            <div className={s.setResult + ' ' + s.clickableShadow}
                key={result}
                onClick={this.goToSet.bind(null, resultData._id)}>
              <p>type: <Link to={'/type/' + resultData.type._id}>
                {resultData.type.title}
              </Link></p>
              <h2>{resultData.title}</h2>
              <p className={s.description}>
                {resultData.description}
              </p>
              <div className={s.rowFlex}>
                <span title={resultData.numItems + ' items in this set'}>
                  {resultData.numItems} <i className="fa fa-file"></i>
                </span>
                <span title={resultData.stars + ' stars'}>
                  {resultData.stars} <i className="fa fa-star"></i>
                </span>
              </div>
            </div>
          );
        })}
        <Waypoint onEnter={this.loadMore} />
        {(() => {
          if (this.props.searchResults.length === 0 && !this.props.loading) {
            return (
              <div className={s.centeredMessage}>
                <i className="fa fa-frown-o" aria-hidden="true">
                </i> no results for {this.props.curSearch}.
              </div>
            );
          }
        })()}
        {(() => {
          if (this.props.loading) {
            return (
              <div className={s.centeredMessage}>
                <i className="fa fa-refresh fa-spin" aria-hidden="true"></i>
              </div>
            );
          }
        })()}
      </section>
    );
  }
}
