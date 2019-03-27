import { Server } from 'net';
import * as SocketIo from 'socket.io';
interface IMessage {
  nickName: string;
  userId: string;
  message: string;
  avatar?: string;
  createTime?: number;
}

const roomList = [
  {id: 0, name: 'React', avatar: '//avatars1.githubusercontent.com/u/11548643?s=460&v=4'},
  {id: 1, name: 'Angular', avatar: '//avatars1.githubusercontent.com/u/11548643?s=460&v=4'},
  {id: 2, name: 'Vue', avatar: '//avatars1.githubusercontent.com/u/11548643?s=460&v=4'},
  {id: 3, name: 'Mobx', avatar: '//avatars1.githubusercontent.com/u/11548643?s=460&v=4'},
  {id: 4, name: 'Axios', avatar: '//avatars1.githubusercontent.com/u/11548643?s=460&v=4'},
  {id: 5, name: 'Java', avatar: '//avatars1.githubusercontent.com/u/11548643?s=460&v=4'},
  {id: 6, name: 'Javascript', avatar: '//avatars1.githubusercontent.com/u/11548643?s=460&v=4'},
];

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

  private onConnection = (socket: SocketIO.Socket) => {
    socket.on('new message', (msg: IMessage) => {
      this.roomServer.emit('new message', msg);
    });
  }
}
