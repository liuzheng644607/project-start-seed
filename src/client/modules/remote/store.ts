import { observable, action, computed } from 'mobx';
import Room, { STREAM_TYPE } from './room';

export class RemoteRoomStore {
  @observable
  videoActive: boolean = false;

  @observable
  audioActive: boolean = false;

  @observable
  peerId: string = '加载中...';

  @observable
  remoteScreenMap: {[key: string]: MediaStream} = {};

  @observable
  remoteAudioMap: {[key: string]: MediaStream} = {};

  @observable
  currentScreen: string = '';

  room = new Room();

  constructor() {
    this.initRoom();
    this.room.on('open', (peerId: string) => {
      this.peerId = peerId;
    });
    this.room.on('remoteStream', (stream, id, type) => {
      if (type === STREAM_TYPE.SCREEN) {
        this.remoteScreenMap[id] = stream;
        if (!this.currentScreen) {
          this.currentScreen = id;
        }
      }

      if (type === STREAM_TYPE.AUDIO) {
        this.remoteAudioMap[id] = stream;
      }

    });
    this.room.on('remoteClose', (id, type) => {
      if (type === STREAM_TYPE.SCREEN) {
        if (id === this.currentScreen) {
          this.currentScreen = '';
        }
        delete this.remoteScreenMap[id];
      }

      if (type === STREAM_TYPE.AUDIO) {
        delete this.remoteAudioMap[id];
      }
    });
  }

  shareScreen = async () => {
    await this.room.shareScreen();
  }

  shareAudio = async () => {
    this.audioActive = true;
    await this.room.shareAudio();
  }

  stopAudio = async () => {
    this.audioActive = false;
    this.room.stopAudio();
  }

  initRoom() {
    this.room.init();
  }
}

export default new RemoteRoomStore();
