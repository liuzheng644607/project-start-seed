"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Router = require("koa-router");
const router_1 = require("@server/decorator/router");
require("./hello");
const router = new Router();
router_1.setRouter(router);
exports.default = router.routes();
//# sourceMappingURL=index.js.map