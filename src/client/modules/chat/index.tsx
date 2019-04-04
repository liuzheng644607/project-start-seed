import * as React from 'react';
import { observer } from 'mobx-react';
import CSSModules from '@utils/cssmodules';
import * as styles from './index.css';
import ChatBox from './ChatBox';
import Welcome from './Welcome';
import ChatStore from './store';

interface IProps {}
interface IState {}

@observer
@CSSModules(styles)
export default class extends React.Component<IProps, IState> {

  render() {
    const { userInfo } = ChatStore;
    return (
      <div styleName="chat">
        <div styleName="chat-main">
         {userInfo ? <ChatBox /> : <Welcome onJoinRoom={() => window.location.reload()}/>}
        </div>
      </div>
    );
  }
}
