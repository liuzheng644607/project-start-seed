import * as React from 'react';
import { observer } from 'mobx-react';
// import * as xss from 'xss';
import Popover, { ArrowContainer } from 'react-tiny-popover';
import CSSModules from '@utils/cssmodules';
import EmojiBox from './Emoji/Emoji';
import * as styles from './index.css';
import ChatStore from './store';

new Array(7).fill(1).forEach((_, idx) => require(`@assets/group/img${idx + 1}.png`));

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

  componentDidMount() {
    document.addEventListener('keydown', this.enter);
  }

  componentWillMount() {
    document.removeEventListener('keydown', this.enter);
  }

  enter = (event: KeyboardEvent) => {
    if (event.keyCode === 13) {
      if (event.shiftKey) {
        return;
      }
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage = () => {
    if (!this.refEditBox) {
      return;
    }

    const value = this.refEditBox.innerHTML;

    if (!value) {
      return;
    }

    // value = xss.filterXSS(value, {
    //   stripIgnoreTag: false,
    //   stripIgnoreTagBody: ['script']
    // });

    console.log(value);

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
      img.style.width = '29px';
      img.style.height = '29px';
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
    const { roomList, activeRoom, currentMessageList, currentUserList } = ChatStore;
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
                    <img src={require(`@assets/group/img${room.avatar}.png`)} alt={room.name} />
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
                <img src={activeRoom && require(`@assets/group/img${activeRoom.avatar}.png`) || ''} />
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
                              __html: item.message,
                              // __html: xss.filterXSS(item.message, {
                              //   stripIgnoreTag: true,
                              //   stripIgnoreTagBody: ['script']
                              // })
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
            <div>在线人数：{currentUserList.length}</div>
            <div styleName="user-list">
              {currentUserList.map((user, idx) => {
                return (
                  <div styleName="item" key={idx}>
                    <img src={user.avatar} alt=""/>
                    <span>
                    {user.nickName}
                    {user.userId === ChatStore.userInfo.userId ? <span style={{color: 'green'}}>（自己）</span> : null}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div styleName="broadcast">
            {/* <marquee behavior="scroll" direction="up" scrollamount="2">
            </marquee> */}
          </div>
        </div>
      </div>
    );
  }
}
