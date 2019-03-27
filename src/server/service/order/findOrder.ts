import { Context } from 'koa';

export default class {

  constructor(
    public ctx: Context
  ) {}

  async findOrder() {
    return {
      orderId: 123213,
    };
  }
}
