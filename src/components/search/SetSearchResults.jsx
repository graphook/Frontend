import React, { Component, PropTypes } from 'react';
import { browserHistory, Link } from 'react-router';
import Waypoint from 'react-waypoint';

import s from '../styles/index.scss';

export default class SetSearchResults extends Component {
  static propTypes = {
    loading: PropTypes.bool,
    results: PropTypes.array,
    objects: PropTypes.object,
    type: PropTypes.string,
    onLoadMore: PropTypes.func,
    curSearch: PropTypes.func
  }
  render() {
    return (
      <section className={s.searchResults}>
        {this.props.results.map((result) => {
          const resultData = this.props.objects[this.props.type][result];
          return (
            <div className={s.setResult + ' ' + s.clickableShadow}
                key={result}
                onClick={() => browserHistory.push('/set/' + result)}>
              <p>type: <Link to={'/type/' + resultData.type._id}>
                {resultData.type.title}
              </Link></p>
              <h2>{resultData.title}</h2>
              <p className={s.description}>
                {resultData.description}
              </p>
              <div className={s.rowFlex}>
                <span title={resultData.numberOfItems + ' items in this set'}>
                  {resultData.numberOfItems} <i className="fa fa-file"></i>
                </span>
                <span title={resultData.stars + ' stars'}>
                  {resultData.stars} <i className="fa fa-star"></i>
                </span>
              </div>
            </div>
          );
        })}
        <Waypoint onEnter={this.props.onLoadMore} />
        {(() => {
          if (this.props.results.length === 0 && !this.props.loading) {
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
