import { Context } from 'koa';
import { GET } from '@server/decorator/router';

export default class {
  @GET('/api/hello')
  hello(ctx: Context) {
    return {
      data: 0
    };
  }
}
