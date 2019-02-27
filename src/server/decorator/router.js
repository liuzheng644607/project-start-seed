"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pathToRegexp = require("path-to-regexp");
var RequestMethod;
(function (RequestMethod) {
    RequestMethod["GET"] = "get";
    RequestMethod["POST"] = "post";
    RequestMethod["DELETE"] = "delete";
    RequestMethod["ALL"] = "all";
    RequestMethod["PUT"] = "put";
})(RequestMethod = exports.RequestMethod || (exports.RequestMethod = {}));
const targetRoutesMap = new Map();
const instanceCache = new Map();
const routes = [];
function route(method, url, middlewares = []) {
    // tslint:disable-next-line:no-any
    return (target, name) => {
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
            const urlKeys = [];
            const routeInfo = {
                method,
                url: u,
                fn: async (ctx, next) => {
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
exports.route = route;
function setRouter(router) {
    routes.forEach((r) => {
        router[r.method](r.url, ...r.middlewares, r.fn);
    });
}
exports.setRouter = setRouter;
function GET(url, middlewares = []) {
    return route(RequestMethod.GET, url, middlewares);
}
exports.GET = GET;
function POST(url, middlewares = []) {
    return route(RequestMethod.GET, url, middlewares);
}
exports.POST = POST;
function DELETE(url, middlewares = []) {
    return route(RequestMethod.DELETE, url, middlewares);
}
exports.DELETE = DELETE;
function PUT(url, middlewares = []) {
    return route(RequestMethod.PUT, url, middlewares);
}
exports.PUT = PUT;
function ALL(url, middlewares = []) {
    return route(RequestMethod.ALL, url, middlewares);
}
exports.ALL = ALL;
//# sourceMappingURL=router.js.map