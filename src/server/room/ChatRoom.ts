import { Server } from 'net';
import { RoomManager } from './BaseRoom';

const roomList = [
  {id: 0, name: 'React', avatar: 1},
  {id: 1, name: 'Angular', avatar: 2},
  {id: 2, name: 'Vue', avatar: 3},
  {id: 3, name: 'Mobx', avatar: 4},
  {id: 4, name: 'Axios', avatar: 5},
  {id: 5, name: 'Java', avatar: 6},
  {id: 6, name: 'Javascript', avatar: 7},
];

export class ChatRoom extends RoomManager {
  constructor(
    public httpServer: Server,
  ) {
    super(httpServer);
    this.socketServer.of('/chat-room').on('connection', (socket) => {
      socket.emit('room list', roomList);
    });

    /**
     * 自动创建10个房间
     */
    roomList.forEach((item) => {
      this.createRoom(item.id);
    });
  }
}
