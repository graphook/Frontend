import React, { Component, PropTypes } from 'react';

import s from '../styles/index.scss';

export default class SearchResults extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    results: PropTypes.array,
    objects: PropTypes.object,
    type: PropTypes.string,
    loadMore: PropTypes.func
  }
  render() {
    return (
      <section className={s.searchResults}>
        <p>Search Not Possible to Display</p>
      </section>
    );
  }
}
