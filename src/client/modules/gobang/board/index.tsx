import * as React from 'react';
import { GoBang } from '../core/GoBang';
import { wrapContext, ContextProps } from '../context/gobang';

interface Props extends ContextProps {
  /**
   * 棋盘大小, 指一行有多少个棋格
   */
  boardSize: number;
  /**
   * 边距
   */
  margin: number;

  roomId: string;
}

class Board extends React.Component<Props> {
  refCanvas: HTMLCanvasElement | null = null;

  gobang?: GoBang;

  removeEvent?: Function;

  get canvas() {
    return this.refCanvas as HTMLCanvasElement;
  }

  componentDidMount() {
    this.init();
    this.bindEvent();
  }

  componentWillUnmount() {
    this.removeEvent?.();
    this.props.playerService.socket?.emit('leave');
  }

  onEnemyPieceDone = (data) => {
    this.gobang?.drawIndexChess(data.index, data.color);
  }

  onPlacingPieceDone = (grid) => {
    this.props.playerService.socket?.emit('enemy-piece-done', grid);
  }

  onWin = (g, s) => {
    // console
    window.setTimeout(() => {
      this.gobang?.reset();
      alert('赢了');
    });
  }

  bindEvent = () => {
    this.gobang?.on('placing-piece-done', this.onPlacingPieceDone).on('win', this.onWin);
    this.props.playerService.socket?.on('enemy-piece-done', this.onEnemyPieceDone);

    this.removeEvent = () => {
      this.gobang?.removeAllListeners();
      this.props.playerService.socket?.removeListener('enemy-piece-done', this.onEnemyPieceDone);
    };
  }

  init = () => {
    const { boardSize, margin } = this.props;
    this.gobang = new GoBang(this.canvas, boardSize, margin);
    this.gobang.init();
    this.props.playerService.socket?.emit('join', this.props.roomId);
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

  regretChess = () => {
    this.gobang?.remove();
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
        <div>
          <button onClick={this.regretChess}>悔棋</button>
        </div>
      </>
    );
  }
}

export default wrapContext(Board);
