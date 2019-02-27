"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const router_1 = require("@server/decorator/router");
class default_1 {
    hello(ctx) {
        return {
            data: 0
        };
    }
}
tslib_1.__decorate([
    router_1.GET('/api/hello')
], default_1.prototype, "hello", null);
exports.default = default_1;
//# sourceMappingURL=hello.js.map