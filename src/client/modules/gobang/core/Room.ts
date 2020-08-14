import uuid from 'uuid/v4';
import { Player, Role } from './Player';

export class Room {
  players: Map<'self' | 'enemy', Player> = new Map();

  constructor() {
    this.joinRoom('enemy', Role.black);
    this.joinRoom('self', Role.white);
  }

  joinRoom(u: 'self' | 'enemy', role: Role) {
    this.players.set(u, new Player({
      role,
      id: uuid(),
    }));
  }
}
