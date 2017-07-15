import React, { Component, PropTypes } from 'react';
import { asyncConnect } from 'redux-async-connect';
import { connect } from 'react-redux';
import {fetchType} from 'redux/modules/typeDetails';
import ReactDOM from 'react-dom';
import {Link} from 'react-router';
import TypeVisualizer from './TypeVisualizer.jsx';
import Helmet from 'react-helmet';

import s from '../styles/index.scss';

@asyncConnect([{
  promise: ({store: {dispatch}, params: {id}}) => {
    const promises = [];
    promises.push(dispatch(fetchType(id)));
    return Promise.all(promises);
  }
}])
@connect(state => {
  const map = {
    id: state.typeDetails.id,
    error: state.typeDetails.error
  };
  if (map.id && state.object.type_type) {
    map.type = state.object.type_type[map.id];
  }
  return map;
}, {fetchType})
export default class Type extends Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string
    }),
    fetchType: PropTypes.func,
    type: PropTypes.object,
    id: PropTypes.string,
    location: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.state = {
      horizontalScrollOffset: 0
    };
  }
  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);
  }

  render() {
    if (this.props.type) {
      return (
        <div className={s.type}>
          <Helmet title={this.props.type.title} />
          <div className={s.infoArea} style={{marginLeft: this.state.horizontalScrollOffset}}>
            <div className={s.typeInfo}>
              <div>
                <h1>{this.props.type.title} ({this.props.type._id})</h1>
                <p>{this.props.type.description}</p>
              </div>
              <nav>
                <span>
                  <i className="fa fa-table"></i> {this.props.type.numUses}
                </span>
              </nav>
            </div>
            <nav className={s.dataNav}>
              {(() => {
                if (this.props.location.query.view === 'json') {
                  return (
                    <Link
                        to={{
                          pathname: this.props.location.pathname,
                          query: {...this.props.location.query, view: 'list'}
                        }}>
                      <i className="fa fa-list-ul"></i>list view
                    </Link>
                  );
                }
                return (
                  <Link
                      to={{
                        pathname: this.props.location.pathname,
                        query: {...this.props.location.query, view: 'json'}
                      }}>
                    <i className="fa fa-align-right"></i>json view
                  </Link>
                );
              })()}
              <Link to="/documentation/Type">
                <i className="fa fa-book"></i>rest api
              </Link>
            </nav>
          </div>
          {(() => {
            if (this.props.location.query.view === 'json') {
              return (
                <pre className={s.jsonArea}>
                  {JSON.stringify(this.props.type.properties, null, 2)}
                </pre>
              );
            }
            return (
              <div className={s.typeVisArea}>
                <TypeVisualizer type={this.props.type} />
              </div>
            );
          })()}
        </div>
      );
    }
    return (<div className={s.centeredMessage}>There was a problem loading this page. Try refreshing.</div>);
  }
}
