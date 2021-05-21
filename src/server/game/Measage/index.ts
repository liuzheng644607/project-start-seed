export enum MessageType {
  Join = 1,
  Leave,
  Talk,
  Action,
  Push,
  RoomsUpdate,
}

export default class Message {
  roomId?: string;
  constructor(
    public type: MessageType,
    public body: any,
  ) {}
}
