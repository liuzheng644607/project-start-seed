import { Context } from 'koa';
import { GET } from '@server/decorator/router';

export default class {
  @GET('/api/monitor/alive')
  hello(ctx: Context) {
    console.log(ctx);
    return {
      data: true,
      message: '成功'
    };
  }
}
