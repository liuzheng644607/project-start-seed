import { Server } from 'http';
import * as SocketIO from 'socket.io';
import cookieParser from '@server/utils/cookie-parse';
import { Rooms } from './Room';
import User from './User';

const userKey = 'localUserInfo';

export default class {
  rooms: Rooms = new Rooms(this.socketServer);
  constructor(
    public httpServer: Server,
    public socketServer: SocketIO.Server = SocketIO(httpServer)
  ) {
    this.socketServer
      .on('connection', this.onConnection);
  }

  private onConnection = (socket: SocketIO.Socket) => {
    // const { roomId } = socket.handshake.query;
    const cookies = cookieParser(socket.handshake.headers.cookie);
    let userInfo = {};
    try {
      userInfo = JSON.parse(decodeURIComponent(cookies[userKey]));
    } catch {}
    const { userId, nickName } = userInfo;
    const user = new User(userId, nickName);
    const rooms = this.rooms;
    rooms.onRoomsUpdate();
    socket.on('join', (roomId) => {
      rooms.join(roomId, user, socket);
    });

    socket.on('create-room', () => {
      // rooms.createRoom(user, socket);
    });

    socket.on('message', (msg) => {
      if (user.roomId) {
        // io.to(user.roomId).emit('message',msg)
        // if(msg.type == 'update'){
        //     user.update(msg.body);
        // }
        msg.user = user.uid;
        rooms.sendToRoom(user.roomId, msg);
      } else {
        this.socketServer.emit('message', msg);
      }
      console.log(msg);
    });

    socket.on('leave', () => {
      rooms.leave(user);
    });

    socket.on('disconnect', () => {
      console.log('连接断开');
      rooms.leave(user);
    });

    socket.on('enemy-piece-done', (data) => {
      socket.broadcast.emit('enemy-piece-done', data);
    });

  }
}
