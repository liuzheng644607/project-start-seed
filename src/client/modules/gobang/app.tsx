import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as SocketClient from 'socket.io-client';
import Board from './board';
import CSSModules from '@utils/cssmodules';
import { RoomContext } from './context/gobang';
import * as styles from './index.css';

interface State {
  socket?: SocketIOClient.Socket;
  roomId?: string;
}

@CSSModules(styles)
export default class extends React.Component<RouteComponentProps<{
  roomId: string;
}>, State> {
  render() {
    return (
      <div styleName="gobang-contanier">
        <Board roomId={this.props.match.params.roomId} boardSize={15} margin={10} />
      </div>
    );
  }
}
