import { EventEmitter } from 'events';
import { Cell, Color } from './Cell';
import { isWin } from './judge';

type EventName = 'placing-piece-done';

export class GoBang extends EventEmitter {
  public static readonly gridSize: number = 50;
  public readonly context: CanvasRenderingContext2D;
  public readonly boardWidth: number;
  public readonly margin: number = 10;
  public readonly gridSize: number = GoBang.gridSize;
  public readonly grids: Cell[] = [];
  public readonly canvas: HTMLCanvasElement;
  public readonly boardSize: number;

  constructor(
    canvas: HTMLCanvasElement,
    boardSize: number,
    margin: number,
  ) {
    super();
    this.canvas = canvas;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
    this.boardSize = boardSize;
    this.boardWidth = boardSize * this.gridSize;
    this.margin = margin;
    this.initGrid();
  }

  // tslint:disable-next-line:no-any
  on(event: EventName, listener: (...args: any[]) => void) {
    super.on(event, listener);
    return this;
  }

  /**
   * 生成棋盘格
   */
  initGrid = () => {
    const { boardWidth, margin, gridSize } = this;
    for (let y = 0; y <= boardWidth; y += gridSize) {
      for (let x = 0; x <= boardWidth; x += gridSize) {
        // 不能超过边界
        if (margin + x >= boardWidth || y + margin >= boardWidth) {
          break;
        }
        this.grids.push(new Cell(
          x + margin,
          y + margin,
          gridSize,
          gridSize,
        ));
      }
    }
  }

  /**
   * 绘制棋盘格
   */
  fillCellColor = () => {
    const context = this.context;
    const highlightColor = '#62d2a2';
    const normalColor = '#1fab89';
    this.grids.forEach((c, i) => {
      if (i % 2 === 0) {
        context.fillStyle = normalColor;
      } else {
        context.fillStyle = highlightColor;
      }
      context.fillRect(c.x, c.y, c.width, c.height);
    });
  }

  /**
   * 绘制棋盘线
   */
  drawLine = () => {
    const context = this.context;
    const { boardWidth, margin, gridSize } = this;
    for (let x = 0; x <= boardWidth; x += gridSize) {
      context.moveTo(0.5 + x + margin, margin);
      context.lineTo(0.5 + x + margin, boardWidth + margin);
    }
    for (let x = 0; x <= boardWidth; x += gridSize) {
      context.moveTo(margin, 0.5 + x + margin);
      context.lineTo(boardWidth + margin, 0.5 + x + margin);
    }
    context.strokeStyle = '#d7fbe8';
    context.stroke();
  }

  /**
   * 绘制场景
   */
  draw = () => {
    this.fillCellColor();
    this.drawLine();
  }

  /**
   * 根据canvas坐标找到相关棋格
   * @param x 横坐标
   * @param y 纵坐标
   */
  findGridByPoint = (x: number, y: number) => {
    const grid = this.grids.find((cell) => {
      return x > cell.x && x < cell.x + cell.width && y > cell.y && y < cell.y + cell.height;
    });
    return grid;
  }

  /**
   * 根据canvas坐标落棋子
   * @param x 横坐标
   * @param y 纵坐标
   * @param color 颜色
   */
  addPoint = (x: number, y: number, color?: Color) => {
    const context = this.context;
    const grid = this.findGridByPoint(x, y);
    const padding = 2;
    const radius = (this.gridSize / 2) - padding;
    if (!grid || grid.filled) {
      return;
    }
    grid.filled = true;
    grid.color = color;
    context.beginPath();
    context.arc(grid.x + radius + padding, grid.y + radius + padding, radius, 0, Math.PI * 2, true);
    context.fillStyle = color === Color?.white ? '#fff' : '#000';
    context.fill();
    context.closePath();
    this.emit('placing-piece-done');
  }
}
