export enum Color {
  black = 1,
  white = 2,
}

export class Cell {
  public readonly x: number;
  public readonly y: number;
  public readonly width: number;
  public readonly height: number;
  public readonly index: number;
  /**
   * 已落棋子颜色
   */
  public color?: Color;
  /**
   * 是否已经落子
   */
  public filled: boolean = false;

  constructor(x: number, y: number, w: number, h: number, index: number) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.index = index;
  }

  /**
   * 重置当前格子的状态
   */
  reset = () => {
    this.color = undefined;
    this.filled = false;
  }
}
