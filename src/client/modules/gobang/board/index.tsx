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
    this.gobang.on('win', (g, s) => {
      window.setTimeout(() => {
        this.gobang?.reset();
        alert('赢了');
      });
    });
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
    return (
      <>
        <canvas
          ref={(c) => {
            this.refCanvas = c;
          }}
          onClick={this.canvasClick}
          onMouseMove={this.mouseMove}
        />
      </>
    );
  }
}
