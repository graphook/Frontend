import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-async-connect';
import { connect } from 'react-redux';
import {Link} from 'react-router';
import Helmet from 'react-helmet';
import {changeSelectedSearch} from 'redux/modules/mainSearch';
import {search} from 'redux/modules/searchResults';
import DefaultSearchResults from 'components/search/DefaultSearchResults.jsx';
import SetSearchResults from 'components/search/SetSearchResults.jsx';
import TypeSearchResults from 'components/search/TypeSearchResults.jsx';

import s from '../styles/index.scss';

const setNameMap = {
  'set_set': 'mainDataSetResults',
  'type_set': 'mainDataTypeResults',
  'insight_set': 'mainInsightResults'
};
const setTypeMap = {
  'set_set': 'set_type',
  'type_set': 'type_type',
  'insight_set': 'insight_type'
};

@asyncConnect([{
  promise: ({ location, store: {dispatch, getState}}) => {
    const promises = [];
    const setName = getState().routing.locationBeforeTransitions.pathname.split('/')[2] || 'set_set';
    const query = location.query.q || '';
    const name = setNameMap[setName];
    promises.push(dispatch(changeSelectedSearch(setName)));
    if (query !== getState()[name].curSearch || !getState()[name].loaded) {
      promises.push(dispatch(search(query || '', 0, setName, name)));
    }
    if (__SERVER__) {
      return Promise.all(promises);
    }
    Promise.all(promises);
  }
}])
@connect(
  (state) => ({
    setName: state.mainSearch.selectedSet,
    modalOpen: state.modal.open,
    searchText: state.mainSearchBar.searchText,
    loading: state[setNameMap[state.mainSearch.selectedSet]].loading,
    results: state[setNameMap[state.mainSearch.selectedSet]].results,
    allResultsLoaded: state[setNameMap[state.mainSearch.selectedSet]].allResultsLoaded,
    curSearch: state[setNameMap[state.mainSearch.selectedSet]].curSearch,
    objects: state.object
  }))
export default class Search extends Component {
  static propTypes = {
    searchText: PropTypes.string,
    loading: PropTypes.bool,
    searchSets: PropTypes.func,
    curSearch: PropTypes.string,
    page: PropTypes.number,
    updateSearchText: PropTypes.func,
    searchResults: PropTypes.array,
    location: PropTypes.object,
    setName: PropTypes.string,
    results: PropTypes.array,
    objects: PropTypes.object
  }
  render() {
    const query = this.props.location.query.q || '';
    const setName = this.props.setName;
    let ResultComponent;
    switch (setName) {
      case 'set_set':
        ResultComponent = SetSearchResults;
        break;
      case 'type_set':
        ResultComponent = TypeSearchResults;
        break;
      default:
        ResultComponent = DefaultSearchResults;
    }
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
          <ResultComponent
            loading={this.props.loading}
            results={this.props.results}
            objects={this.props.objects}
            type={setTypeMap[setName]}
            onLoadMore={()=> console.log('loading more')}
            curSearch={this.props.curSearch} />
        </div>
      </div>
    );
  }
}
