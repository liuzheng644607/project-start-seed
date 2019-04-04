import { observable, action, computed } from 'mobx';
import * as SocketClient from 'socket.io-client';

const userKey = 'localUserInfo';

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
  createTime?: number;
}

export class ChatStore {

  initSocket() {
    if (this.socket) {
      return;
    }
    this.socket = SocketClient('/chat-room');
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

  @computed
  get userInfo() {

    const userInfo = localStorage.getItem(userKey);
    if (userInfo) {
      return JSON.parse(userInfo);
    }
  }

  newMessageCallbacks: Function[] = [];

  socket!: SocketIOClient.Socket;

  socketMap: Map<number, SocketIOClient.Socket> = new Map();

  @observable
  messageMap: Map<number, IMessage[]> = new Map();

  @observable
  roomList: Room[] = [];

  @observable
  activeRoom: Room | null = null;

  @computed
  get currentMessageList(): IMessage[] {
    let id = -1;
    if (this.activeRoom) {
      id = this.activeRoom.id;
    }
    this.newMessageCallbacks.forEach((item) => item());
    return this.messageMap.get(id) || [];
  }

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
        // 最多100
        messageList = messageList.slice(messageList.length - 100);
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

  saveUser(v: {nickName: string, avatar: string}) {
    const uuid = 'uuid_' + Math.random().toString(16).slice(2);
    const info = {
      userId: uuid,
      ...v,
    };

    const userInfo = JSON.stringify(info);
    localStorage.setItem(userKey, userInfo);
  }

  onMessageRefresh(cbk: Function) {
    this.newMessageCallbacks.push(cbk);
  }
}

export default new ChatStore();
