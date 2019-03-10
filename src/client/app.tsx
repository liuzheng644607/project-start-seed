import * as React from 'react';
import { render } from 'react-dom';
import Login from './modules/login';
import './app.css';

class App extends React.Component {
  render() {
    return (
      <Login />
    );
  }
}

render(<App />, document.getElementById('app'));
