import React from 'react';
import Login from '../chat/Welcome';
import CSSModules from '@utils/cssmodules';
import * as styles from './index.css';

@CSSModules(styles)
export default class extends React.Component {
  render() {
    return (
      <div styleName="login">
        <Login />
      </div>
    );
  }
}
