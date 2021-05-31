import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import Login from '../chat/Welcome';
import qs from 'querystring';
import CSSModules from '@utils/cssmodules';
import * as styles from './index.css';
@CSSModules(styles)
export default class extends React.Component<RouteComponentProps<{
}>> {
  componentDidMount() {
    document.documentElement.classList.add(styles.pageWrap);
  }

  componentWillUnmount() {
    document.documentElement.classList.remove(styles.pageWrap);
  }

  redirect = () => {
    const query = qs.parse(this.props.location.search.slice(1));
    const r = decodeURIComponent(query.redirect as string);
    this.props.history.replace(r);
  }

  render() {
    return (
      <div styleName="login">
        <Login onJoinRoom={this.redirect} />
      </div>
    );
  }
}
