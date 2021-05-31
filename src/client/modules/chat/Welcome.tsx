// tslint:disable:no-var-requires
import * as React from 'react';
import CSSModules from '@utils/cssmodules';
import { observer } from 'mobx-react';
import * as styles from './index.css';
import ChatStore from './store';

const avatarList = [
  require('@assets/avatar/1.png'),
  require('@assets/avatar/2.jpeg'),
  require('@assets/avatar/3.png'),
  require('@assets/avatar/4.jpeg'),
  require('@assets/avatar/5.png')
];

interface IProps {
  onJoinRoom?: () => void;
}
interface IState {
  showBtn: boolean;
  nickName: string;
  avatar: string;
}

@observer
@CSSModules(styles)
export default class extends React.Component<IProps, IState> {
  state = {
    showBtn: false,
    nickName: '',
    avatar: avatarList[2]
  };

  onValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    this.setState({ showBtn: !!value.trim(), nickName: value });
  };

  onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    this.setState({ avatar: value});
  };

  joinRoom = () => {
    ChatStore.saveUser({
      nickName: this.state.nickName,
      avatar: this.state.avatar,
    });

    if (this.props.onJoinRoom) {
      this.props.onJoinRoom();
    }
  };

  render() {
    const { nickName, avatar } = this.state;
    return (
      <div styleName="welcome">
        <div styleName="input-wrap">
          <div styleName="title">请输入您的昵称...</div>
          <input
            autoFocus
            type="text"
            onChange={this.onValueChange}
            maxLength={8}
          />
          <div styleName="avatar-list">
            {avatarList.map((src, i) => {
              return (
                <label key={i} styleName="avatar-wrap" title="点击选择头像">
                  <input
                    type="radio"
                    name="avatar"
                    value={src}
                    checked={avatar === src}
                    onChange={this.onAvatarChange}
                  />
                  <img src={src} alt="avatar" />
                </label>
              );
            })}
          </div>
          <div styleName="confirm-name">
            {nickName ? (
              <a onClick={this.joinRoom} href="javascript:;">
                确定
              </a>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
