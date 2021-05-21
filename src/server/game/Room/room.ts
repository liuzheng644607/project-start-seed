import Message, { MessageType } from '../Measage';
import User from '../User';

export default class Room {
  /**
   * 用户列表
   */
  public userMap: Map<string, User> = new Map();

  get userList() {
    const list: User[] = [];
    this.userMap.forEach((v) => {
      list.push(v);
    });
    return list;
  }

  constructor(
    /**
     * roomid
     */
    public id: string,
    /**
     * socketServer
     */
    public socketServer: SocketIO.Server,
  ) {}

  /**
   * 添加用户
   */
  addUser = (user: User, client: SocketIO.Socket) => {
    const roomId = this.id;
    return new Promise((resolve, reject) => {
      client.join(roomId, (error) => {
        if (error) {
          reject(error);
        }
        user.updateRoom(roomId, client);
        this.userMap.set(user.uid, user);
        console.log('加入房间', roomId, user.nickName);
        this.sendMsg(new Message(MessageType.Join, {
            user: user.uid,
            userList: this.userList,
        }));
        resolve(user);
      });
    });
  }

  sendMsg = (msg: Message) => {
    const roomId = this.id;
    msg.roomId = roomId;
    this.socketServer?.to(roomId).emit('message', msg);
  }

  toJSON = () => {
    return {
      id: this.id,
      userMap: this.userMap,
      userList: this.userList,
    };
  }

  leave = (user: User) => {
    this.userMap.delete(user.uid);
    user.client?.leave(user.roomId!, () => {
      this.sendMsg(new Message(MessageType.Leave, {
        user: user.uid,
        peoples: this.userList,
      }));
    });
  }
}
