import * as React from 'react';
import Board from './board';
import CSSModules from '@utils/cssmodules';
import * as styles from './index.css';

@CSSModules(styles)
export default class extends React.Component {
  render() {
    return (
      <div styleName="gobang-contanier">
        <Board boardSize={15} margin={10} />
      </div>
    );
  }
}
