// tslint:disable:no-any
import url from 'url';
import uuid from 'uuid/v4';
import device from '@utils/device';
import { EventEmitter } from 'events';
import Peer, { MediaConnection } from 'peerjs';
import mqtt, { MqttClient } from 'mqtt';
const { query } = url.parse(location.href, true);
const ROOM: {[key: string]: any} = {};
const SEPARATOR = '(ง •̀_•́)ง';
const localidkey = 'localidkey';
const handleError = (err: Error) => console.log(err);
enum ACTIONS {
  JOIN_ROOM = 'joinroom',
  ROOM_USER = 'roomuser',
  STOP_SHARE = 'stopshare',
  AUDIO_STOPED = 'audiostoped'
}
export enum STREAM_TYPE {
  SCREEN = 'screen',
  AUDIO = 'audio',
  VIDEO = 'video',
}
const ID = localStorage.getItem(localidkey);
const LOCAL_ID = ID ? ID : uuid();
localStorage.setItem(localidkey, LOCAL_ID);

window.ROOM = ROOM;

export default class extends EventEmitter {
  sharedScreenStream: MediaStream = new MediaStream();
  audioStream: MediaStream = new MediaStream();
  videoStream: MediaStream = new MediaStream();
  roomId: string = String(query.id || '');
  mqttClient: MqttClient = mqtt.connect('wss://broker.peerjs.com');
  peer: Peer = new Peer(LOCAL_ID, { debug: 3 });

  HANDLE_ACTION = {
    [ACTIONS.JOIN_ROOM]: (payload: string) => {
      if (payload !== LOCAL_ID) {
        console.log(payload, '加入了会议');
        this.publish(ACTIONS.ROOM_USER, `${LOCAL_ID}`);
        this.updateUserInfo(payload);
        this.syncState(payload);
      }
    },
    [ACTIONS.ROOM_USER]: (payload: string) => {
      if (payload !== LOCAL_ID) {
        this.updateUserInfo(payload);
      }
    },
    [ACTIONS.STOP_SHARE]: (payload: string) => {
      if (payload !== LOCAL_ID) {
        this.emit('remoteClose', payload, STREAM_TYPE.SCREEN);
        delete ROOM[this.roomId][payload].sharedScreenConnection;
      }
    },
    [ACTIONS.AUDIO_STOPED]: (payload: string) => {
      if (payload !== LOCAL_ID) {
        this.emit('remoteClose', payload, STREAM_TYPE.AUDIO);
        delete ROOM[this.roomId][payload].sharedAudioConnection;
      }
    }
  };

  constructor() {
    super();
    this.sharedScreenStream.oninactive = () => this.onincative(STREAM_TYPE.SCREEN);
    this.audioStream.oninactive = () => this.onincative(STREAM_TYPE.AUDIO);
    this.mqttClient.on('message', this.onMqttMessage);
    this.subscribeRoom();
  }

  private onMqttMessage = (topic: string, message: any) => {
    const [action, payload] = message.toString().split(SEPARATOR);
    ROOM[this.roomId] = ROOM[this.roomId] || {};
    this.HANDLE_ACTION[action as ACTIONS](payload);
  };

  private subscribeRoom = () => {
    this.mqttClient.subscribe(this.roomId, (err) => {
      if (err) {
        handleError(err);
      }
    });
  }

  private updateUserInfo = (userId: string, obj: Object = {}) => {
    ROOM[this.roomId] = ROOM[this.roomId] || {};
    ROOM[this.roomId][userId] = ROOM[this.roomId][userId] || {};
    ROOM[this.roomId][userId] = Object.assign(ROOM[this.roomId][userId], obj);
  }

  private publish = (action: ACTIONS, msg: string = '') => {
    return this.mqttClient.publish(this.roomId, `${action}${SEPARATOR}${msg}`);
  }

  /**
   * 同步自己的状态
   */
  private syncState = (peerId: string) => {
    if (this.sharedScreenStream.active) {
      this.shareToOthers(peerId, this.sharedScreenStream, STREAM_TYPE.SCREEN);
    }
    if (this.audioStream.active) {
      this.shareToOthers(peerId, this.audioStream, STREAM_TYPE.AUDIO);
    }
  }

  private onincative = (type: STREAM_TYPE) => {
    let key = '';
    if (type === STREAM_TYPE.SCREEN) {
      this.removeAllTracks();
      key = 'screenMediaConnection';
      this.publish(ACTIONS.STOP_SHARE, LOCAL_ID);
    }
    if (type === STREAM_TYPE.AUDIO) {
      key = 'audioMediaConnection';
      this.publish(ACTIONS.AUDIO_STOPED, LOCAL_ID);
    }

    Object.keys(ROOM[this.roomId]).forEach((id) => {
      if (ROOM[this.roomId][id][key]) {
        ROOM[this.roomId][id][key].close();
        delete ROOM[this.roomId][id][key];
      }
    });
  }

  /**
   * 移除所有tracks
   */
  private removeAllTracks() {
    this.sharedScreenStream.getTracks().forEach((track) => {
      track.stop();
      this.sharedScreenStream.removeTrack(track);
    });
  }

  /**
   * 向某一个节点分享屏幕
   */
  private shareToOthers(peerId: string, stream: MediaStream, type: STREAM_TYPE) {
    const call = this.peer.call(peerId, stream, { metadata: { type }});
    if (type === STREAM_TYPE.SCREEN) {
      this.updateUserInfo(peerId, { screenMediaConnection: call });
    }
    if (type === STREAM_TYPE.AUDIO) {
      this.updateUserInfo(peerId, { audioMediaConnection: call });
    }
  }

  private onRemoteClosed = (remotePeerId: string, type: STREAM_TYPE) => {
    this.emit('remoteClose', remotePeerId, type);
  }

  private oniceconnectionstatechange(remoteMediaConnection: MediaConnection, cbk: Function) {
    if (remoteMediaConnection.peerConnection) {
      // tslint:disable-next-line:max-line-length
      const originalOniceconnectionstatechange = remoteMediaConnection.peerConnection.oniceconnectionstatechange as any;
      remoteMediaConnection.peerConnection.oniceconnectionstatechange = () => {
        if (originalOniceconnectionstatechange) {
          originalOniceconnectionstatechange(remoteMediaConnection.peerConnection);
        }
        if (remoteMediaConnection.peerConnection && remoteMediaConnection.peerConnection.iceConnectionState === 'disconnected') {
          cbk();
        }
      };
    }
  }

  init() {
    this.peer.on('open', () => {
      this.connectZoom();
      this.emit('open', LOCAL_ID);
    });

    this.peer.on('error', ({ message }) => {
      if (/is taken/.test(message)) {
        localStorage.removeItem(localidkey);
        window.location.reload();
      }
    });

    this.peer.on('call', (remoteMediaConnection) => {
      const canvas = document.createElement('canvas');
      const s = canvas.captureStream(25);
      const remotePeerId = remoteMediaConnection.peer;
      const { type } = remoteMediaConnection.metadata;
      remoteMediaConnection.answer(s);
      const close = () => this.onRemoteClosed(remotePeerId, STREAM_TYPE.SCREEN);
      remoteMediaConnection.on('stream', (stream) => {
        this.emit('remoteStream', stream, remotePeerId, type);
      });
      remoteMediaConnection.on('close', close);
      remoteMediaConnection.on('error', close);
      this.oniceconnectionstatechange(remoteMediaConnection, close);
      if (type === STREAM_TYPE.SCREEN) {
        this.updateUserInfo(remoteMediaConnection.peer, { sharedScreenConnection: remoteMediaConnection });
      }
      if (type === STREAM_TYPE.AUDIO) {
        this.updateUserInfo(remoteMediaConnection.peer, { sharedAudioConnection: remoteMediaConnection });
      }
    });
  }

  connectZoom() {
    if (this.roomId) {
      this.publish(ACTIONS.JOIN_ROOM, LOCAL_ID);
    }
  }

  async getScreenStream() {
    let screenStream: MediaStream;
    try {
      screenStream = await device.getScreenStream();
    } catch (e) {
      alert(e);
      return;
    }
    const currentStreamTrack = screenStream.getVideoTracks()[0];
    this.removeAllTracks();
    this.sharedScreenStream.addTrack(currentStreamTrack);
  }

  async shareAudio() {
    const stream = this.audioStream = await device.getUserMedia({ audio: true, video: false});
    const peerIds = Object.keys(ROOM[this.roomId]);
    peerIds.forEach((peerId) => {
      this.shareToOthers(peerId, stream, STREAM_TYPE.AUDIO);
    });
  }

  async stopAudio() {
    this.audioStream.getTracks().forEach((track) => {
      track.stop();
    });
    this.onincative(STREAM_TYPE.AUDIO);
  }

  async shareScreen() {
    await this.getScreenStream();
    const peerIds = Object.keys(ROOM[this.roomId]);
    peerIds.forEach((peerId) => {
      this.shareToOthers(peerId, this.sharedScreenStream, STREAM_TYPE.SCREEN);
    });
  }
}
