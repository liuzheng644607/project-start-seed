import * as React from 'react';
import { observer } from 'mobx-react';
import * as xss from 'xss';
import Popover, { ArrowContainer } from 'react-tiny-popover';
import CSSModules from '@utils/cssmodules';
import EmojiBox from './Emoji/Emoji';
import * as styles from './index.css';
import ChatStore from './store';

interface IProps {}
interface IState {
  emojiShow: boolean;
}

@observer
@CSSModules(styles)
export default class extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    ChatStore.initSocket();
    ChatStore.onMessageRefresh(() => {
      requestAnimationFrame(() => {
        const scrollElement = document.querySelector<HTMLElement>('#js-message-scroll');
        if (scrollElement) {
          if (this.refContainer) {
            this.refContainer.scrollTo({top: scrollElement.offsetHeight});
          }
        }
      });
    });
  }

  state = {
    emojiShow: false,
  };

  refEditBox: HTMLPreElement | null = null;
  refContainer: HTMLDivElement | null = null;

  sendMessage = () => {
    if (!this.refEditBox) {
      return;
    }

    let value = this.refEditBox.innerHTML;
    value = xss.filterXSS(value, {
      stripIgnoreTag: false,
      stripIgnoreTagBody: ['script']
    });

    ChatStore.sendMessage(value);

    this.refEditBox.innerHTML = '';
  };

  toggleEmoji = (show: boolean = true) => {
    this.setState({ emojiShow: show });
  }

  selectEmoji = (src: string) => {
    this.toggleEmoji(false);
    if (this.refEditBox) {
      const img = document.createElement('img');
      if (document.activeElement !== this.refEditBox) {
        this.refEditBox.focus();
      }
      img.src = src;
      img.width = 29;
      img.height = 29;
      if (window.getSelection) {
        const sel = window.getSelection();
        const range = sel.getRangeAt(0);
        // range.deleteContents();
        range.insertNode(img);
        range.collapse(false);
      }
    }
  }

  render() {
    const { roomList, activeRoom, currentMessageList } = ChatStore;
    const { emojiShow } = this.state;
    // tslint:disable-next-line:no-any
    const msgList = currentMessageList;
    return (
      <div styleName="inner">
        <div styleName="panel-group">
          <div>
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
        </div>
        <div styleName="content-view">
          <div styleName="chat-area">
            <div styleName="head">
              <div styleName="title-wrap">
                <img src={activeRoom && activeRoom.avatar || ''} />
                <span>{(activeRoom && activeRoom.name) || '未选择'}</span>
              </div>
            </div>
            <div styleName="message-area">
              <div styleName="message-list" ref={(c) => this.refContainer = c}>
                <div id="js-message-scroll">
                {msgList.map((item, index) => {
                  const { userInfo } = item;
                  const self =
                    userInfo && userInfo.userId === ChatStore.userInfo.userId;
                  return (
                    <div
                      key={index}
                      styleName={`message-item ${
                        self ? 'send-item' : 'receive-item'
                      }`}
                    >
                      <img src={userInfo && userInfo.avatar} alt="" />
                      <div styleName="content">
                        {self ? null : (
                          <h4 styleName="nikename">
                            {userInfo && userInfo.nickName}
                          </h4>
                        )}
                        <div styleName="bubble">
                          <div
                            styleName="plain"
                            dangerouslySetInnerHTML={{
                              __html: xss.filterXSS(item.message, {
                                stripIgnoreTag: true,
                                stripIgnoreTagBody: ['script']
                              })
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
            <div styleName="edit-area">
              <div styleName="tool-box">
                <Popover
                  isOpen={emojiShow}
                  align="start"
                  onClickOutside={() => this.toggleEmoji(false)}
                  content={({ position, targetRect, popoverRect }) => (
                    <ArrowContainer
                      position={position}
                      targetRect={targetRect}
                      popoverRect={popoverRect}
                      arrowColor={'#fff'}
                      arrowSize={15}
                      arrowStyle={{left: 3, bottom: 4}}
                    >
                      <EmojiBox
                        onSelect={(src) => this.selectEmoji(src)}
                      />
                    </ArrowContainer>
                  )}
                >
                  <i styleName="emoji" onClick={() => this.toggleEmoji(true)}/>
                </Popover>
              </div>
              <div styleName="edit-wrap">
                <pre
                  styleName="edit-msg"
                  contentEditable
                  autoFocus
                  ref={c => (this.refEditBox = c)}
                />
              </div>
              <div styleName="action">
                <a
                  styleName="btn-send"
                  onClick={this.sendMessage}
                  href="javascript:;"
                >
                  发送
                </a>
              </div>
            </div>
          </div>
        </div>
        <div styleName="user-panel">
          <div styleName="topic-container">
            <p>学习交流</p>
          </div>
          <div styleName="online-container">
            <div>在线人数：</div>
            <div styleName="user-list">
              <div styleName="item">
                <img src={require('@assets/avatar/1.png')} alt=""/>
                <span>哈哈</span>
              </div>
              <div styleName="item">
                <img src={require('@assets/avatar/1.png')} alt=""/>
                <span>哈哈</span>
              </div>
            </div>
          </div>
          <div styleName="broadcast">
          </div>
        </div>
      </div>
    );
  }
}
