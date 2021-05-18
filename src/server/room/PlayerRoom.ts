import { Server } from 'net';
import { RoomManager } from './BaseRoom';

export class PlayerRoom extends RoomManager {
  constructor(
    public httpServer: Server,
  ) {
    super(httpServer);
    this.socketServer.of('/player-room').on('connection', (socket) => {
      const { roomId } = socket.handshake.query;
      socket.join(roomId, () => {
        const rooms = Object.keys(socket.rooms);
        console.log(rooms);
      });
      // socket.rooms
      // this.createRoom(roomId);
    });
  }
}
