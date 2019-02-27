import { Context } from 'koa';
import * as Router from 'koa-router';
import * as pathToRegexp from 'path-to-regexp';

type Middleware = Router.IMiddleware;

export enum RequestMethod {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
  ALL = 'all',
  PUT = 'put',
}

type Method = 'get' | 'post' | 'put' | 'delete' | 'all';

export interface Route {
  method: Method;
  url: string;
  fn: (ctx: Context, next: Function) => void;
  regexp: RegExp;
  name: string;
  urlKeys: pathToRegexp.Key[];
  middlewares: Middleware[];
}

const targetRoutesMap: Map<Object, Route[]> = new Map();
const instanceCache = new Map();
const routes: Route[] = [];

export function route(method: Method, url: string | string[], middlewares: Middleware[] | Middleware = []) {
  // tslint:disable-next-line:no-any
  return (target: any, name: string) => {
    let instance = instanceCache.get(target);
    if (!instance) {
      // 实例化路由 controller
      instance = new target.constructor();
      instanceCache.set(target, instance);
    }

    if (!Array.isArray(url)) {
      url = [url];
    }

    url.forEach((u) => {
      const urlKeys: pathToRegexp.Key[] = [];

      const routeInfo = {
        method,
        url: u,
        fn: async (ctx: Context, next: Function) => {
          const result = await instance[name].call(instance, ctx, next);
          ctx.body = ctx.body || result;
        },
        regexp: pathToRegexp(u, urlKeys),
        name,
        urlKeys,
        middlewares: Array.isArray(middlewares) ? middlewares : [middlewares],
      };

      // 将路由信息和对应的 Controller 关联起来
      let targetRoutes = targetRoutesMap.get(target.constructor);
      if (!targetRoutes) {
        targetRoutes = [];
      }
      targetRoutes.push(routeInfo);
      targetRoutesMap.set(target.constructor, targetRoutes);

      routes.push(routeInfo);
    });
  };
}

export function setRouter(router: Router) {
  routes.forEach((r) => {
    router[r.method](r.url, ...r.middlewares, r.fn);
  });
}

export function GET(url: string | string[], middlewares: Middleware[] | Middleware = []) {
  return route(RequestMethod.GET, url, middlewares);
}

export function POST(url: string | string[], middlewares: Middleware[] | Middleware = []) {
  return route(RequestMethod.GET, url, middlewares);
}

export function DELETE(url: string | string[], middlewares: Middleware[] | Middleware = []) {
  return route(RequestMethod.DELETE, url, middlewares);
}

export function PUT(url: string | string[], middlewares: Middleware[] | Middleware = []) {
  return route(RequestMethod.PUT, url, middlewares);
}

export function ALL(url: string | string[], middlewares: Middleware[] | Middleware = []) {
  return route(RequestMethod.ALL, url, middlewares);
}
