import { Cell } from './Cell';
import { GoBang } from './GoBang';

export function isWin(grid: Cell, gobang: GoBang) {
  if (!grid.filled) {
    return;
  }

  /**
   * 横向
   */
  const currentGridIndex = grid.index;
  const { boardSize, grids } = gobang;
  // 在第几列，从 0 列开始
  const colIndex = (currentGridIndex) % boardSize;
  // 在第几行，从 0 行开始
  const rowIndex = Math.floor(currentGridIndex / boardSize);
  let winGrids: Cell[] = [];
  let count = 5;
  /**
   * 判断是否同色
   * @param r 行索引
   * @param c 列索引
   */
  const processElement = (r: number, c: number) => {
    const index = r * boardSize + c;
    const element = grids[index];
    if (count > 0 && element.color === grid.color) {
      winGrids.push(element);
      count--;
      return true;
    } else {
      return false;
    }
  };
  /**
   * 横线
   */
  if (count !== 0) {
    count = 5;
    winGrids = [];
    for (let r = rowIndex, c = colIndex; r >= 0 && c < boardSize; c++) {
      if (!processElement(r, c)) {
        break;
      }
    }
    for (let r = rowIndex, c = colIndex - 1; r >= 0 && c >= 0; c--) {
      if (!processElement(r, c)) {
        break;
      }
    }
  }

  /**
   * 竖线
   */
  if (count !== 0) {
    count = 5;
    winGrids = [];
    for (let r = rowIndex, c = colIndex; c >= 0 && r >= 0; r--) {
      if (!processElement(r, c)) {
        break;
      }
    }
    for (let r = rowIndex + 1, c = colIndex; r < boardSize && c >= 0; r++) {
      if (!processElement(r, c)) {
        break;
      }
    }
  }

  /**
   * 右斜
   */
  if (count !== 0) {
    count = 5;
    winGrids = [];
    for (let r = rowIndex, c = colIndex; r >= 0 && c < boardSize; r--, c++) {
      if (!processElement(r, c)) {
        break;
      }
    }
    for (let r = rowIndex + 1, c = colIndex - 1; c >= 0 && r < boardSize; r++, c--) {
      if (!processElement(r, c)) {
        break;
      }
    }
  }

  /**
   * 左斜
   */
  if (count !== 0) {
    count = 5;
    winGrids = [];
    for (let r = rowIndex, c = colIndex; r >= 0 && c >= 0; r--, c--) {
      if (!processElement(r, c)) {
        break;
      }
    }
    for (let r = rowIndex + 1, c = colIndex + 1; c < boardSize && r < boardSize; r++, c++) {
      if (!processElement(r, c)) {
        break;
      }
    }
  }

  if (count === 0) {
    return {
      win: count === 0,
      winGrids,
    };
  }
}
