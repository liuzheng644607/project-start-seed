import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './modules/home';
import ChatRoom from './modules/chat';
import RemoteZoom from './modules/remote';
import 'normalize.css';
import 'antd/dist/antd.less';
import './app.css';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/chat-room" component={ChatRoom} />
      <Route path="/remote" component={RemoteZoom} />
      <Route path="/login" component={require('./modules/login').default} />
      <Route path="/picker" component={require('./modules/picker').default} />
      <Route path="/gobang" component={require('./modules/gobang').default} />
      <Route path="/avatart-gen" component={require('./modules/avatarGen').default} />
    </Router>
  );
}

render(<App />, document.getElementById('app'));
