export enum Role {
  black = 1,
  white = 2,
}

export class Player {
  public role: Role;
  public id: string;

  constructor(opt: {
    role: Role;
    id: string;
  }) {
    this.role = opt.role;
    this.id = opt.id;
  }
}
