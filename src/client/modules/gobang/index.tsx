import * as React from 'react';
import * as SocketClient from 'socket.io-client';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { RoomContext } from './context/gobang';
import Home from './home';

export default class extends React.Component {

  socket = SocketClient();

  render() {
    return (
      <RoomContext.Provider
        value={{
          socket: this.socket,
        }}
      >
        <Router>
          <Route path="/gobang/home" component={Home} />
          <Route path="/gobang/room/:roomId" component={require('./app').default} />
        </Router>
      </RoomContext.Provider>
    );
  }
}
