import * as React from 'react';
import { observer } from 'mobx-react';
import CSSModules from '@utils/cssmodules';
import * as styles from './index.css';
import ChatStore from './store';

interface IProps {}
interface IState {}

@observer
@CSSModules(styles)
export default class extends React.Component<IProps, IState> {
  refEditBox: HTMLDivElement | null = null;

  sendMessage = () => {
    if (!this.refEditBox) {
      return;
    }

    const value = this.refEditBox.innerHTML;

    ChatStore.sendMessage(value);

    this.refEditBox.innerHTML = '';
  };

  render() {
    const { roomList, activeRoom, messageMap } = ChatStore;
    let id = -1;
    if (activeRoom) {
      id = activeRoom.id;
    }
    // tslint:disable-next-line:no-any
    const msgList = messageMap.get(id) || [];
    return (
      <div styleName="chat">
        <div styleName="chat-main">
          <div styleName="inner">
            <div styleName="panel-group">
              {roomList.map(room => {
                return (
                  <div
                    styleName={`chat-item ${
                      activeRoom && activeRoom.id === room.id ? 'active' : null
                    }`}
                    key={room.id}
                    onClick={() => ChatStore.chooseRoom(room)}
                  >
                    <div styleName="avatar">
                      <img src={room.avatar} alt={room.name} />
                    </div>
                    <div className="info">
                      <h3 styleName="nickname">{room.name}</h3>
                    </div>
                  </div>
                );
              })}
            </div>
            <div styleName="content-view">
              <div styleName="chat-area">
                <div styleName="head">
                  <div styleName="title-wrap">
                    {(activeRoom && activeRoom.name) || '未选择'}
                  </div>
                </div>
                <div styleName="message-area">
                  <div styleName="message-list">
                    {msgList.map((item, index) => {
                      const { userInfo } = item;
                      const self =
                        userInfo &&
                        userInfo.userId === ChatStore.userInfo.userId;
                      return (
                        <div
                          key={index}
                          styleName={`message-item ${
                            self ? 'send-item' : 'receive-item'
                          }`}
                        >
                          <img
                            src="//avatars1.githubusercontent.com/u/11548643?s=460&v=4"
                            alt=""
                          />
                          <div styleName="content">
                            <h4 styleName="nikename">sfadf</h4>
                            <div styleName="bubble">
                              <div styleName="plain">{item.message}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div styleName="edit-area">
                  <div
                    styleName="edit-msg"
                    contentEditable
                    ref={(c) => (this.refEditBox = c)}
                  />
                  <div styleName="action">
                    <span styleName="desc">按下Cmd+Enter</span>
                    <a
                      styleName="btn"
                      onClick={this.sendMessage}
                      href="javascript:;"
                    >
                      发送
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
