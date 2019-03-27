import { Context } from 'koa';

export default class User {

  constructor(
    public ctx: Context
  ) {}

  /**
   * 获取用户信息
   */
  async getUserInfo() {
    return {
      name: 'lyan',
      avatar: '',
    };
  }
}
