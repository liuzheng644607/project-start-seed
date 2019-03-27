import { observable, action } from 'mobx';
import * as SocketClient from 'socket.io-client';

export interface Room {
  id: number;
  name: string;
  avatar: string;
}

export interface UserInfo {
  userId: string;
  nickName?: string;
  avatar?: string;
}

export interface IMessage {
  userInfo?: UserInfo;
  message: string;
}

export class ChatStore {
  constructor() {
    this.socket
      .on('connect', () => {
        this.socket.emit('event', 'afsdfsd');
      })
      .on('event', (data: number) => {
        console.log(data);
      })
      // tslint:disable-next-line:no-any
      .on('room list', (roomList: Room[]) => {
        this.refreshRoomList(roomList);
      });
  }

  get userInfo() {
    const userKey = 'localUserInfo';
    let userInfo = localStorage.getItem(userKey);
    if (userInfo) {
      return JSON.parse(userInfo);
    }
    const uuid = 'uuid_' + Math.random().toString(16).slice(2);
    const info = {
      userId: uuid
    };
    userInfo = JSON.stringify(info);
    localStorage.setItem(userKey, userInfo);

    return userInfo;
  }

  socket = SocketClient('/chat-room');

  socketMap: Map<number, SocketIOClient.Socket> = new Map();

  @observable
  messageMap: Map<number, IMessage[]> = new Map();

  @observable
  roomList: Room[] = [];

  @observable
  activeRoom: Room | null = null;

  @action
  refreshRoomList(list: Room[]) {
    if (!this.activeRoom) {
      this.chooseRoom(list[0]);
    }
    this.roomList = list;
  }

  @action
  chooseRoom(room: Room) {
    this.activeRoom = room;
    this.connectRoom(room);
  }

  private connectRoom(room: Room) {
    const { id } = room;

    let roomSocket = this.socketMap.get(id);
    if (!roomSocket) {
      roomSocket = SocketClient('/' + String(id));
      // tslint:disable-next-line:no-any
      roomSocket.on('new message', (data: IMessage) => {
        let messageList = this.messageMap.get(id);
        if (!messageList) {
          messageList = [];
        }
        messageList.push(data);
        this.messageMap.set(id, messageList);
      });
      this.socketMap.set(id, roomSocket);
    }
  }

  @action
  sendMessage(message: string) {
    const { id } = this.activeRoom!;
    const roomSocket = this.socketMap.get(id);
    if (!roomSocket) {
      return;
    }
    roomSocket.emit('new message', {
      message,
      userInfo: this.userInfo,
    });
  }
}

export default new ChatStore();
