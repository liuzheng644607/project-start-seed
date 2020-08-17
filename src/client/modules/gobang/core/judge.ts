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
  const startColIndex = currentGridIndex - colIndex;
  const endColIndex = startColIndex + boardSize - 1;
  let winGrids: Cell[] = [];
  let count = 5;
  /**
   * 横线赢法
   */
  if (count !== 0) {
    for (let index = currentGridIndex; index <= endColIndex; index++) {
      const element = grids[index];
      if (count > 0 && element.color === grid.color) {
        winGrids.push(element);
        count--;
      }
    }
    for (let index = currentGridIndex - 1; index >= startColIndex; index--) {
      const element = grids[index];
      if (count > 0 && element.color === grid.color) {
        winGrids.push(element);
        count--;
      }
    }
  }

  /**
   * 竖线赢法
   */
  if (count !== 0) {
    count = 5;
    winGrids = [];
    for (let index = currentGridIndex; Math.floor(index / boardSize) >= 0; index -= boardSize) {
      const element = grids[index];
      if (count > 0 && element.color === grid.color) {
        winGrids.push(element);
        count--;
      }
    }
    for (
      let index = currentGridIndex + boardSize;
      Math.floor(index / boardSize) < boardSize;
      index += boardSize
      ) {
      const element = grids[index];
      if (count > 0 && element.color === grid.color) {
        winGrids.push(element);
        count--;
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
      const index = r * boardSize + c;
      const element = grids[index];
      if (count > 0 && element.color === grid.color) {
        winGrids.push(element);
        count--;
      }
    }
    for (let r = rowIndex + 1, c = colIndex - 1; c >= 0 && r < boardSize; r++, c--) {
      const index = r * boardSize + c;
      const element = grids[index];
      if (count > 0 && element.color === grid.color) {
        winGrids.push(element);
        count--;
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
      const index = r * boardSize + c;
      const element = grids[index];
      if (count > 0 && element.color === grid.color) {
        winGrids.push(element);
        count--;
      }
    }
    for (let r = rowIndex + 1, c = colIndex + 1; c < boardSize && r < boardSize; r++, c++) {
      const index = r * boardSize + c;
      const element = grids[index];
      if (count > 0 && element.color === grid.color) {
        winGrids.push(element);
        count--;
      }
    }
  }

  if (count === 0) {
    console.log('win', winGrids);
    winGrids.forEach((c) => {
      // highlightPoint(c);
    });

    return {
      win: count === 0,
      winGrids,
    };
  }
}
