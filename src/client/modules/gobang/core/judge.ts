import { Cell } from './Cell';

export function isWin(board: Cell[][], x: number, y: number, chess?: number) {
  let i = x;
  let j = y;
  let count = 0;
  /*计算水平方向连续棋子个数*/
  while (i > -1 && board[i][j].color === chess) {
    i--;
    count++; // 累加左侧
  }
  i = x + 1;
  while (i < 15 && board[i][j].color === chess) {
    i++;
    count++; // 累加右侧
  }

  if (count >= 5) {
    return true; // 获胜
  }

  /*计算竖直方向连续棋子个数*/
  i = x;
  count = 0;
  while (j > -1 && board[i][j].color === chess) {
    j--;
    count++; // 累加上方
  }
  j = y + 1;
  while (j < 15 && board[i][j].color === chess) {
    j++;
    count++; // 累加下方
  }
  if (count >= 5) {
    return true;
  }

  /*计算左上右下方向连续棋子个数*/
  j = y;
  count = 0;
  while (i > -1 && j > -1 && board[i][j].color === chess) {
    i--;
    j--;
    count++; // 累加左上
  }
  i = x + 1;
  j = y + 1;
  while (i < 15 && j < 15 && board[i][j].color === chess) {
    i++;
    j++;
    count++; // 累加右下
  }
  if (count >= 5) {
    return true;
  }

  /*计算右上左下方向连续棋子个数*/
  i = x;
  j = y;
  count = 0;
  while (i < 15 && j > -1 && board[i][j].color === chess) {
    i++;
    j--;
    count++; // 累加右上
  }
  i = x - 1;
  j = y + 1;
  while (i > -1 && j < 15 && board[i][j].color === chess) {
    i--;
    j++;
    count++; // 累加左下
  }
  if (count >= 5) {
    return true;
  }

  return false;
}
