import * as React from 'react';
import { GoBang } from '../core/GoBang';
import { Room } from '../core/Room';

interface Props {
  /**
   * 棋盘大小, 指一行有多少个棋格
   */
  boardSize: number;
  /**
   * 边距
   */
  margin: number;
}

export default class extends React.Component<Props> {
  refCanvas: HTMLCanvasElement | null = null;

  gobang?: GoBang;

  room = new Room();

  get canvas() {
    return this.refCanvas as HTMLCanvasElement;
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    const { boardSize, margin } = this.props;
    this.gobang = new GoBang(this.canvas, boardSize, margin);
    this.gobang.draw();
  }

  canvasClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { x, y } = this.canvas.getBoundingClientRect();
    this.gobang?.addPoint(
      e.clientX - x,
      e.clientY - y,
      1,
    );
  }

  mouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const { x, y } = this.canvas.getBoundingClientRect();
    const grid = this.gobang?.findGridByPoint(
      e.clientX - x,
      e.clientY - y,
    );
    this.canvas.style.cursor = grid?.filled ? 'not-allowed' : '';
  }

  render() {
    const { boardSize, margin } = this.props;
    const size = boardSize * GoBang.gridSize + margin * 2;
    return (
      <>
        <canvas
          ref={(c) => {
            this.refCanvas = c;
          }}
          width={size}
          height={size}
          onClick={this.canvasClick}
          onMouseMove={this.mouseMove}
        />
      </>
    );
  }
}
