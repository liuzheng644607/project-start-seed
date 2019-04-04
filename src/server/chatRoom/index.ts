import { Server } from 'net';
import * as SocketIo from 'socket.io';
interface IMessage {
  nickName: string;
  userId: string;
  message: string;
  avatar?: string;
  createTime?: number;
}

// tslint:disable:max-line-length

const roomList = [
  {id: 0, name: 'React', avatar: '//www.newasp.net/attachment/soft/2015/0729/145032_26578755.png'},
  {id: 1, name: 'Angular', avatar: '//img.pconline.com.cn/images/upload/upc/tx/pcdlc/1507/10/c0/9582428_9582428_1436519464953.jpg'},
  {id: 2, name: 'Vue', avatar: '//pic.52112.com/icon/256/20180514/15574/725950.png'},
  {id: 3, name: 'Mobx', avatar: '//android-artworks.25pp.com/fs08/2016/06/07/7/1_fd125dc92c85b47c78da43debb14c455_con.png'},
  {id: 4, name: 'Axios', avatar: '//img1.3lian.com/gif/more/11/201205/53eb40701e6e749cde13fe9abc4352c3.jpg'},
  {id: 5, name: 'Java', avatar: '//img.apk3.com/img2018/5/22/19/2018052260936300.jpg'},
  {id: 6, name: 'Javascript', avatar: '//img0.sc115.com/uploads/png/110125/20110125140453687.png'},
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
      this.roomServer.emit('new message', Object.assign(msg, {createTime: Date.now()}));
    });
  }
}
