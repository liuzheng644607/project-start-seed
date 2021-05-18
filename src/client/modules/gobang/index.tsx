import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as SocketClient from 'socket.io-client';
import Board from './board';
import CSSModules from '@utils/cssmodules';
import * as styles from './index.css';

@CSSModules(styles)
export default class extends React.Component<RouteComponentProps<{
  roomId: string;
}>> {
  socket!: SocketIOClient.Socket;

  initSocket() {
    const { roomId } = this.props.match.params;
    if (this.socket || !roomId) {
      return;
    }
    this.socket = SocketClient('/player-room', {
      query: {
        roomId,
      }
    });
    this.socket
      .on('connect', () => {
      })
      .on('event', (data: number) => {
        console.log(data);
      });
  }

  componentDidMount() {
    this.initSocket();
  }

  render() {
    return (
      <div styleName="gobang-contanier">
        <Board boardSize={15} margin={10} />
      </div>
    );
  }
}
