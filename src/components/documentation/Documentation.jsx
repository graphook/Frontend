import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import { fetchUser } from 'redux/modules/profileDetails';
import { Link } from 'react-router';
import Tutorial from './pages/Tutorial.jsx';
import sections from './sections';
import {scroller} from 'react-scroll';
import {fetchDocumentation} from 'redux/modules/documentation';

import IntroAuth from './pages/IntroAuth.jsx';
import GetTutorial from './pages/GetTutorial.jsx';
import SearchTutorial from './pages/SearchTutorial.jsx';
import CreateSetTutorial from './pages/CreateSetTutorial.jsx';
import UpdateTutorial from './pages/UpdateTutorial.jsx';
import CreateTypeTutorial from './pages/CreateTypeTutorial.jsx';

import s from '../styles/index.scss';

const specialComponents = {
  'IntroAuth': IntroAuth,
  'GetTutorial': GetTutorial,
  'SearchTutorial': SearchTutorial,
  'CreateSetTutorial': CreateSetTutorial,
  'UpdateTutorial': UpdateTutorial,
  'CreateTypeTutorial': CreateTypeTutorial
}

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];
    promises.push(dispatch(fetchUser()));
    if (!getState().documentation.loaded) {
      promises.push(dispatch(fetchDocumentation()));
    }
    return Promise.all(promises);
  }
}])
@connect((state) => ({
  categories: state.documentation.categories
}))
export default class Documentation extends Component {
  static propTypes = {
    params: PropTypes.object
  }
  constructor(props) {
    super(props);
    this.state = {
      sidePanelClosed: true
    }
  }
  componentDidMount() {
    this.goToProperPlace();
  }
  componentDidUpdate() {
    this.goToProperPlace();
  }
  goToProperPlace = () => {
    console.log('going to propper place');
    scroller.scrollTo(this.props.params.subTopic, {
      offset: -4,
      containerId: 'docs'
    });
  }
  render() {
    let DocComponent = IntroAuth;
    let category = {};
    this.props.categories.forEach((cat) => {
      if (cat.category === this.props.params.topic) {
        if (cat.specialComponent) {
          DocComponent = specialComponents[cat.specialComponent];
          category = cat;
        } else {
          DocComponent = 'Not Implemented'
        }
      }
    })
    return (
      <div className={s.documentation}>
        <nav className={s.docNav + (this.state.sidePanelClosed ? ' ' + s.closed : '' )}>
          <i className={'fa ' + s.panelToggler + (this.state.sidePanelClosed ? ' fa-chevron-right' : ' fa-chevron-left')}
            onClick={() => this.setState({ sidePanelClosed: !this.state.sidePanelClosed })}></i>
          <ul className={s.categoryList}>
            {this.props.categories.map((category) => {
              return (<li>
                <Link to={'/documentation/' + category.category} className={s.categoryHeader}>{category.category}</Link>
                <ul>
                  {(() => {
                    if (category.routes) {
                      return category.routes.map((route) => {
                        return (<li>
                          <Link to={'/documentation/' + category.category + '/' + route.method + route.path.replace(new RegExp('/', 'g'), ' ')}>
                            <span className={s.method}>{route.method}</span> {route.path}
                          </Link>
                        </li>)
                      });
                    }
                    return category.subTopics.map((subTopic) => {
                      return (<li>
                        <Link to={'/documentation/' + category.category + '/' + subTopic.title}>
                          {subTopic.title}
                        </Link>
                      </li>);
                    });
                  })()}
                </ul>
              </li>)
            })}
          </ul>
        </nav>
        <div className={s.docContentContainer} id="docs">
          <div className={s.docContent}>
            <DocComponent category={category} />
          </div>
        </div>
      </div>
    );
  }
}
