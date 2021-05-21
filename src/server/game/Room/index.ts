import Room from './room';
import User from '../User';
import Message, { MessageType } from '../Measage';

export class Rooms {
  roomMap: Map<string, Room> = new Map();
  private incrId: number = 1;

  MAX_COUNT = 20;

  constructor(
    public socketServer: SocketIO.Server,
  ) {
    this.createRooms();
  }

  get roomList() {
    const rooms: Room[] = [];
    this.roomMap.forEach((room) => {
      rooms.push(room);
    });
    return rooms;
  }

  createRooms() {
    for (let index = 0; index < this.MAX_COUNT; index++) {
      const roomId = String(this.incrId++);
      this.roomMap.set(roomId, new Room(roomId, this.socketServer));
    }
    this.onRoomsUpdate();
  }

  async join(roomId: string, user: User, client: SocketIO.Socket) {
    if (user.roomId) {
      this.leave(user);
    }

    // if (!this.roomMap.has(roomId)) {
    //   this.roomMap.set(roomId, new Room(roomId, this.socketServer));
    // }

    await this.roomMap.get(roomId)?.addUser(user, client);
    this.onRoomsUpdate();
  }

  leave(user: User) {
    const {roomId} = user;
    if (roomId) {
      const room = this.roomMap.get(roomId);
      room?.leave(user);
    }

    this.onRoomsUpdate();
  }

  onRoomsUpdate = () => {
    const msg = new Message(MessageType.RoomsUpdate, this.roomList);
    this.socketServer.emit('message', msg);
  }

  sendToRoom(roomId: string, msg: Message) {
    this.roomMap.get(roomId)?.sendMsg(msg);
  }
}
