import * as mosca from 'mosca';
import { Client, Packet } from 'mosca';

const option = {
  post: 1883,
  backend: {}
};

const server = new mosca.Server(option);

server.on('clientConnected', (client: Client) => {
  console.log('client connected', client.id);
});

// fired when a message is received
server.on('published', (packet: Packet) => {
  console.log(packet.topic);
});

server.on('ready', () => {
  console.log('Mosca server is up and running');
});
