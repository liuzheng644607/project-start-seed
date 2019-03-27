import * as React from 'react';
import * as SocketClient from 'socket.io-client';
import CSSModules from '@utils/cssmodules';
import * as styles from './index.css';

interface IProps {}
interface IState {}

@CSSModules(styles)
export default class extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.socket
      .on('connect', () => {
        this.socket.emit('event', 'afsdfsd');
      })
      .on('event', (data: number) => {
        console.log(data);
      });
  }

  socket = SocketClient('/chat-room');

  render() {
    return (
      <div styleName="home">
        <img src={require('@assets/img/kangna.gif')}/>
      </div>
    );
  }
}
