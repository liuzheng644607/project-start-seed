import * as React from 'react';
import CSSModules from '@utils/cssmodules';
import * as styles from './index.css';

@CSSModules(styles)
export default class extends React.Component {
  render() {
    return (
      <div styleName="login">
        <p styleName="text">测试</p>
      </div>
    );
  }
}
