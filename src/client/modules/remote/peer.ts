import Peer from 'peerjs';

const localPeerKey = 'localPeerKey';
const localPeerId = localStorage.getItem(localPeerKey);
export default class PeerAdapter {
  peer: Peer = new Peer({
    // host: 'peer.lyan.me',
    // secure: false,
    // port: 9000,
    debug: 3
  });

  constructor() {
    this.peer.on('open', (id) => {
      localStorage.setItem(localPeerKey, id);
    });
  }

  listAllPeers() {
    return new Promise<string[]>((resolve) => {
      this.peer.listAllPeers((peerIds = []) => {
        resolve(peerIds);
      });
    });
  }
}
