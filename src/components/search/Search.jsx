import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-async-connect';
import { connect } from 'react-redux';
import {Link} from 'react-router';
import Helmet from 'react-helmet';
import {changeSelectedSearch} from 'redux/modules/mainSearch';
import SearchResults from './SearchResults';
import {search} from 'redux/modules/searchResults';

import s from '../styles/index.scss';

const setNameMap = {
  'set_set': 'mainDataSetResults',
  'type_set': 'mainDataTypeResults',
  'insight_set': 'mainInsightResults'
}

@asyncConnect([{
  promise: ({ location, store: {dispatch, getState}}) => {
    console.log('in here')
    const promises = [];
    const setName = getState().routing.locationBeforeTransitions.pathname.split('/')[2] || 'set_set';
    const query = location.query.q || '';
    const name = setNameMap[setName];
    promises.push(dispatch(changeSelectedSearch(setName)));
    if (query !== getState()[name].curSearch || !getState()[name].loaded) {
      promises.push(dispatch(search(query || '', 0, setName, name)));
    }
    if (__SERVER__) {
      console.log('in there');
      return Promise.all(promises);
    } else {
      Promise.all(promises);
    }
  }
}])
@connect(
  (state, props) => ({
    setName: state.mainSearch.selectedSet,
    modalOpen: state.modal.open,
    searchText: state.mainSearchBar.searchText,
    loading: state[setNameMap[state.mainSearch.selectedSet]].loading,
    results: state[setNameMap[state.mainSearch.selectedSet]].results,
    allResultsLoaded: state[setNameMap[state.mainSearch.selectedSet]].allResultsLoaded,
    curSearch: state[setNameMap[state.mainSearch.selectedSet]].curSearch,
  }))
export default class SetSearch extends Component {
  static propTypes = {
    searchText: PropTypes.string,
    loading: PropTypes.bool,
    searchSets: PropTypes.func,
    curSearch: PropTypes.string,
    page: PropTypes.number,
    updateSearchText: PropTypes.func,
    searchResults: PropTypes.array,
    setHash: PropTypes.object,
    location: PropTypes.object,
    setName: PropTypes.string
  }
  render() {
    const query = this.props.location.query.q || '';
    const setName = this.props.setName;
    const name = setNameMap[setName];
    return (
      <div>
        {(() => {
          if (this.props.location.pathname === '/') {
            return (
              <div key="background" className={s.banner}>
                <div className={s.centeredMessage + ' ' + s.largeHeader}>
                  <h1>zenow</h1>
                  <p>create, share, and find free public data</p>
                </div>
              </div>
            );
          }
        })()}
        <div className={s.search}>
          <Helmet title={query || 'Search'} />
          <nav className={s.searchNav}>
            <ul className={s.tabs}>
              {/* <li className={s.selected}><a><i className="fa fa-bar-chart"></i>Insights</a></li> */}
              <li className={(setName === 'set_set' ? s.selected : '')}>
                <Link to={'/search/set_set?q=' + query}><i className="fa fa-table"></i>Data Sets</Link>
              </li>
              <li className={(setName === 'type_set' ? s.selected : '')}>
                <Link to={'/search/type_set?q=' + query}><i className="fa fa-file-text"></i>Data Types</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }
}
