import { Context } from 'koa';
import * as assert from 'assert';
import * as Router from 'koa-router';

type Middleware = Router.IMiddleware;

export enum RequestMethod {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
  ALL = 'all',
  PUT = 'put',
  HEAD = 'head',
  PATCH = 'patch',
}

// tslint:disable-next-line:no-any
const methodList = Object.keys(RequestMethod).map((k: any) => RequestMethod[k]);

type Method = 'get' | 'post' | 'put' | 'delete' | 'all' | 'head' | 'patch';

const rootRouter = new Router();

export function route(url: string | string[],
                      method?: Method,
                      // tslint:disable-next-line:no-any
                      middlewares: Middleware[] | Middleware = []): any {
  // tslint:disable-next-line:no-any
  return (target: any, name: string, descriptor?: any) => {

    const midws = Array.isArray(middlewares) ? middlewares : [middlewares];

    /**
     * 装饰类
     */
    if (typeof target === 'function' && name === undefined  && descriptor === undefined) {
      assert(!method, '@route 装饰Class时，不能有method 参数' );

      /**
       * 我们将router绑定在 原型上，方便访问
       */
      if (!target.prototype.router) {
        target.prototype.router = new Router();
      }
      /**
       * 仅仅设置Controller 前缀
       */
      target.prototype.router.prefix(url);

      /**
       * 使得当前Controller 可以执行一些公共的中间件
       */
      if (middlewares.length > 0) {
        target.prototype.router.use(...midws);
      }
      return;
    }

    /**
     * 装饰方法
     */
    if (!target.router) {
      target.router = new Router();
    }

    if (!method) {
      method = 'get';
    }

    assert(!!target.router[method], `第二个参数只能是如下值之一 ${methodList}`);
    assert(typeof target[name] === 'function', `@route 只能装饰Class 或者 方法`);

    /**
     * 使用router
     */
    target.router[method](url, ...midws, async (ctx: Context, next: Function) => {
      /**
       * 执行原型方法
       */
      const result = await descriptor.value(ctx, next);
      ctx.body = result;
    });

    /**
     * 将所有被装饰的路由挂载到rootRouter，为了暴露出去给 koa 使用
     */
    rootRouter.use(target.router.routes());
  };
}

/**
 * 暴露router给koa使用
 */
export function getRouter() {
  return rootRouter;
}
