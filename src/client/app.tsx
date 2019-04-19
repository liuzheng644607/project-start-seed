import * as React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from './modules/home';
import ChatRoom from './modules/chat';
import 'normalize.css';
import './app.css';

function App() {
  return (
    <Router>
      <Route path="/" exact component={Home} />
      <Route path="/chat-room" component={ChatRoom} />
    </Router>
  );
}

render(<App />, document.getElementById('app'));
