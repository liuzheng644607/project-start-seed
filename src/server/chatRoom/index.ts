import { Server } from 'net';
import * as SocketIo from 'socket.io';
import cookieParser from '@server/utils/cookie-parse';
interface IMessage {
  nickName: string;
  userId: string;
  message: string;
  avatar?: string;
  createTime?: number;
}

// tslint:disable:max-line-length

const roomList = [
  {id: 0, name: 'React', avatar: '//upload-images.jianshu.io/upload_images/188895-3f031917c4d3e6e5.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'},
  {id: 1, name: 'Angular', avatar: '//upload-images.jianshu.io/upload_images/188895-fcc2f21344d23c5d.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'},
  {id: 2, name: 'Vue', avatar: '//upload-images.jianshu.io/upload_images/188895-9bd7f17687e06297.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'},
  {id: 3, name: 'Mobx', avatar: '//upload-images.jianshu.io/upload_images/188895-7ec02d155b0f1da9.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'},
  {id: 4, name: 'Axios', avatar: '//upload-images.jianshu.io/upload_images/188895-1c4ee37d26f9905f.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'},
  {id: 5, name: 'Java', avatar: '//upload-images.jianshu.io/upload_images/188895-28b511d42c96d3fd.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'},
  {id: 6, name: 'Javascript', avatar: '//upload-images.jianshu.io/upload_images/188895-c03a472f50f00888.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240'},
];

const userKey = 'localUserInfo';

export class ChatRoom {

  roomPool: Map<number, Room> = new Map();

  constructor(
    public httpServer: Server,
    public socketServer: SocketIO.Server = SocketIo(httpServer)
  ) {
    socketServer.of('/chat-room').on('connection', (socket) => {
      socket.emit('room list', roomList);
      // socket.on('add user', (userName: string) => {

      // });
    });

    /**
     * 自动创建10个房间
     */
    roomList.forEach((item) => {
      this.createRoom(item.id);
    });
  }

  /**
   * 创建一个房间
   * @param id
   */
  createRoom(id: number) {
    let room = this.roomPool.get(id);
    if (!room) {
      room = new Room(id, this.socketServer);
      this.roomPool.set(id, room);
    }
    return room;
  }
}

// tslint:disable-next-line:max-classes-per-file
export class Room {
  roomServer: SocketIO.Namespace;

  constructor(
    id: number,
    socketServer: SocketIO.Server,
  ) {
    this.roomServer = socketServer.of('/' + String(id));
    this.roomServer.on('connection', this.onConnection);
  }

  private userList: any[] = [];

  private onConnection = (socket: SocketIO.Socket) => {
    const cookies = cookieParser(socket.handshake.headers.cookie);
    const userInfo = JSON.parse(decodeURIComponent(cookies[userKey]));

    if (!this.userList.find((item) => item.userId === userInfo.userId)) {
      this.userList.push(userInfo);
    }

    socket.on('new message', (msg: IMessage) => {
      this.roomServer.emit('new message', Object.assign(msg, {createTime: Date.now()}));
    });

    socket.on('user_join_room', (user) => {
      this.roomServer.emit('user_join_room', {userList: this.userList, user});
    });

    socket.on('disconnect', () => {
      const idx = this.userList.findIndex((u) => {
        return u.userId === userInfo.userId;
      });

      if (idx !== -1) {
        this.userList.splice(idx, 1);
      }

      this.roomServer.emit('user_join_room', {userList: this.userList});
    });
  }
}
