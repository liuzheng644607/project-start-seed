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
    </Router>
  );
}

render(<App />, document.getElementById('app'));
