export enum Color {
  black = 1,
  white = 2,
}

export class Cell {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  /**
   * 已落棋子颜色
   */
  public color?: Color;
  /**
   * 是否已经落子
   */
  public filled: boolean = false;

  constructor(x: number, y: number, w: number, h: number) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }
}
