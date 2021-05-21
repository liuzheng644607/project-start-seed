import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import * as SocketClient from 'socket.io-client';
import { Card, Col, Row, Button, Tag } from 'antd';
import { Link } from 'react-router-dom';
import CSSModules from '@utils/cssmodules';
import { wrapContext, ContextProps } from '../context/gobang';
import * as styles from './index.css';

interface Props extends ContextProps, RouteComponentProps<{
}> {
}
interface State {
}

@CSSModules(styles)
class Home extends React.Component<Props, State> {

  state = {
    roomList: []
  };

  constructor(props) {
    super(props);
    this.props.playerService.socket?.on('message', this.onMessage);
  }

  onMessage = (msg) => {
    const { type, roomId, body } = msg;
    const map = {
      1: () => {
        this.props.history.push(`/gobang/room/${roomId}`);
      },
      6: () => {
        this.setState({
          roomList: body,
        });
      }
    };
    map[type]?.();
  }

  createRoom = () => {
    this.props.playerService.socket?.emit('create-room');
  }

  componentWillUnmount() {
    this.props.playerService.socket?.removeListener('message', this.onMessage);
  }

  render() {
    const { roomList } = this.state;
    return (
      <div styleName="gobang-home">
        <Row gutter={[16, 16]}>
          {roomList.map((room) => {
            return (
              <Col span={6} key={room.id}>
                <Card size="small" title={`房间${room.id}`} extra={<Link to={`/gobang/room/${room.id}`}>进入</Link>} >
                  <div styleName="room-content">
                    <p>当前用户：
                      {room.userList?.map((user) => {
                        return <Tag key={user.uid}>{user.nickName}</Tag>;
                      })}
                    </p>
                    <p>对战时长：</p>
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </div>
    );
  }
}

export default wrapContext(Home);
