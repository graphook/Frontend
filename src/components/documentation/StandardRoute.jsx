import React, {Component, PropTypes} from 'react';
import RequestTool from './RequestTool.jsx';
import TypeVisualizer from 'components/type/TypeVisualizer.jsx';

import s from 'components/styles/index.scss';

export default class StandardRoute extends Component {
  static propTypes = {
    paramType: PropTypes.object,
    bodyType: PropTypes.object,
    request: PropTypes.obejct
  }
  render() {
    return (
      <div>
        {(() => {
          const toRender = [];
          if (this.props.paramType) {
            toRender.push(
              <div className={s.requestTool + ' ' + s.clickableShadow}>
                <h2>url parameters</h2>
                <TypeVisualizer type={this.props.paramType} />
              </div>
            );
          }
          if (this.props.bodyType) {
            toRender.push(
              <div className={s.requestTool + ' ' + s.clickableShadow}>
                <h2>request body</h2>
                <TypeVisualizer type={this.props.bodyType} />
              </div>
            );
          }
          toRender.push(<RequestTool {...this.props.request} />);
          return toRender;
        })()}
      </div>
    );
  }
}
