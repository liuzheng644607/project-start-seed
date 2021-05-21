import * as React from 'react';
import { observer } from 'mobx-react';
import CSSModules from '@utils/cssmodules';
import * as styles from './index.css';
import { Button } from 'antd';
import { Icon } from 'antd';
import { RemoteRoomStore } from './store';

const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_276519_ybkj1tj8u8e.js'
});

interface IProps {}
interface IState {
  showScreenList: boolean;
}

@observer
@CSSModules(styles)
export default class extends React.Component<IProps, IState> {
  state = {
    showScreenList: false,
  };

  store = new RemoteRoomStore();

  render() {
    const store = this.store;
    const { audioActive, videoActive, currentScreen, remoteAudioMap, remoteScreenMap } = this.store;
    const { showScreenList } = this.state;

    return (
      <div styleName="p-room" onClick={() => this.setState({ showScreenList: false })}>
        <div styleName="main-panel">
          <div style={{display: 'none'}}>
            {Object.keys(remoteAudioMap).map((id) => {
              return (
                <audio
                  key={id}
                  autoPlay
                  ref={(c) => {
                    if (c) {
                      c.srcObject = remoteAudioMap[id];
                    }
                  }}
                />
              );
            })}
          </div>
          <div className="js-screen-container" styleName="screen-container">
            {currentScreen ? (
              <video
                autoPlay
                ref={c => {
                  if (c) {
                    c.srcObject = remoteScreenMap[currentScreen];
                  }
                }}
              />
            ) : null}
          </div>
          {
            showScreenList ? (
              <div styleName="video-list-container">
                <div styleName="videolist">
                  {Object.keys(remoteScreenMap).map(id => {
                    return (
                      <div
                        key={id}
                        styleName="video-item"
                        onClick={() => {
                          store.currentScreen = id;
                          this.setState({ showScreenList: false });
                        }}
                      >
                        <video
                          autoPlay
                          ref={c => {
                            if (c) {
                              c.srcObject = remoteScreenMap[id];
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null
          }
        </div>
        <div styleName="control-bar">
          <div styleName="left-control">
            <div styleName="control-item">
              <Button
                type="link"
                onClick={() => {
                  if (!store.audioActive) {
                    store.shareAudio();
                  } else {
                    store.stopAudio();
                  }
                }}
              >
                {audioActive ? (
                  <IconFont styleName="active" type="icon-mic" />
                ) : (
                  <IconFont styleName="danger" type="icon-mic_off" />
                )}
              </Button>
            </div>
            {/* <div styleName="control-item" style={{ marginTop: 2 }}>
              <Button
                type="link"
                onClick={() => (store.videoActive = !store.videoActive)}
              >
                {videoActive ? (
                  <IconFont styleName="active" type="icon-videocam" />
                ) : (
                  <IconFont styleName="danger" type="icon-video-off" />
                )}
              </Button>
            </div> */}
          </div>
          <div styleName="main-control">
            <div styleName="control-item">
              <Button type="link">
                <IconFont type="icon-user_add" />
              </Button>
            </div>
            <div styleName="control-item">
              <Button type="link">
                <IconFont type="icon-group" />
              </Button>
            </div>
            <div styleName="control-item">
              <Button
                type="link"
                onClick={store.shareScreen}
                onMouseOver={() => this.setState({ showScreenList: true })}
              >
                <IconFont type="icon-Share" />
              </Button>
            </div>
            <div styleName="control-item">
              <Button type="link">
                <IconFont type="icon-message" />
              </Button>
            </div>
          </div>
          <div styleName="right-control">
            <div styleName="peer-id">ID: {store.peerId}</div>
            <Button type="link">退出</Button>
          </div>
        </div>
      </div>
    );
  }
}
