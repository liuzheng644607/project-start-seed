import { EventEmitter } from 'events';
import { Cell, Color } from './Cell';
import { isWin } from './judge';

type EventName = 'placing-piece-done' | 'win';

export class GoBang extends EventEmitter {
  public static readonly gridSize: number = 50;
  /**
   * 边距
   */
  public readonly margin: number = 10;
  /**
   * 格子大小
   */
  public readonly gridSize: number = GoBang.gridSize;
  public readonly context: CanvasRenderingContext2D;
  public readonly boardWidth: number;
  public grids: Cell[] = [];
  /**
   * canvas
   */
  public readonly canvas: HTMLCanvasElement;
  /**
   * 棋盘大小，横向有多少个格子
   */
  public readonly boardSize: number;
  /**
   * 棋子边距
   */
  private readonly pointPadding: number = 4;
  /**
   * 半径
   */
  private readonly pointRadius: number = (this.gridSize / 2) - this.pointPadding;

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
    this.init();
  }

  initBoard = () => {
    const { boardSize, canvas, context, margin } = this;
    const size = boardSize * GoBang.gridSize + margin * 2;
    const setScale = (d: number) => {
      canvas.style.width = size + 'px';
      canvas.style.height = size + 'px';
      canvas.height = size * d;
      canvas.width = size * d;
      context.scale(d , d);
    };
    window.devicePixelRatio ? setScale(window.devicePixelRatio) : setScale(1);
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
    let index = 0;
    this.grids = [];
    for (let y = 0; y <= boardWidth; y += gridSize) {
      for (let x = 0; x <= boardWidth; x += gridSize) {
        // 不能超过边界
        if (margin + x >= boardWidth || y + margin >= boardWidth) {
          break;
        }
        const cell = new Cell(
          x + margin,
          y + margin,
          gridSize,
          gridSize,
          index
        );
        this.grids.push(cell);
        this.drawCell(cell, index);
        index++;
      }
    }

    this.context.save();
  }

  drawCell = (c: Cell, i: number) => {
    const context = this.context;
    const highlightColor = '#62d2a2';
    const normalColor = '#1fab89';
    if (i % 2 === 0) {
      context.fillStyle = normalColor;
    } else {
      context.fillStyle = highlightColor;
    }
    context.strokeStyle = '#d7fbe8';
    context.lineWidth = 1;
    context.strokeRect(c.x, c.y, c.width, c.height);
    context.fillRect(c.x, c.y, c.width, c.height);
  }

  init = () => {
    this.initBoard();
    this.initGrid();
  }

  clear = () => {
    const context = this.context;
    const { boardWidth, margin } = this;
    context.beginPath();
    context.clearRect( 0, 0, boardWidth + margin * 2, boardWidth + margin * 2);
    context.closePath();
  }

  reset = () => {
    this.clear();
    this.initGrid();
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
    const grid = this.findGridByPoint(x, y);
    if (!grid || grid.filled) {
      return;
    }
    grid.filled = true;
    grid.color = color;
    this.drawPoint(grid, color === Color?.white ? '#fff' : '#000');
    this.emit('placing-piece-done');
    this.isWin(grid);
  }

  drawPoint = (grid: Cell, color?: string) => {
    const context = this.context;
    const padding = this.pointPadding;
    const radius = this.pointRadius;
    context.beginPath();
    context.arc(grid.x + radius + padding, grid.y + radius + padding, radius, 0, Math.PI * 2, true);
    context.closePath();
    // 渐变
    const gradient = context.createRadialGradient(
      grid.x + radius + padding, grid.y + radius + padding,
      radius,
      grid.x + radius + padding, grid.y + radius + padding,
      0
      );
    if (color === '#fff') {
      gradient.addColorStop(0, '#d1d1d1');
      gradient.addColorStop(1, '#f9f9f9');
    } else {
      gradient.addColorStop(0, '#0a0a0a');
      gradient.addColorStop(1, '#636766');
    }
    context.fillStyle = gradient;
    context.fill();
  }

  genPoint = () => {

  }

  highlightPoint = (grid: Cell) => {
    this.drawPoint(grid, 'red');
  }

  isWin = (grid: Cell) => {
    if (!grid.filled) {
      return false;
    }
    const { win, winGrids } = isWin(grid, this) || {};
    if (win) {
      this.emit('win', grid, winGrids);
    }
  }
}
