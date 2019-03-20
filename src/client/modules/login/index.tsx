import * as React from 'react';
import CSSModules from '@utils/cssmodules';
import * as styles from './index.css';

@CSSModules(styles)
export default class extends React.Component {
  render() {
    return (
      <div styleName="login">
        <img src={require('@assets/img/kangna.gif')}/>
      </div>
    );
  }
}
