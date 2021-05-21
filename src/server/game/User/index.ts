export default class User {
  client?: SocketIO.Socket;

  roomId?: string;

  constructor(
    /**
     * 用户id
     */
    public uid: string,
    /**
     * 用户昵称
     */
    public nickName: string,
  ) {
  }

  updateRoom(
    roomId?: string,
    client?: SocketIO.Socket,
  ) {
    this.roomId = roomId;
    this.client = client;
  }

  toJSON() {
    return {
      roomId: this.roomId,
      uid: this.uid,
      nickName: this.nickName,
    };
  }

}
