"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouterPluginImpl = void 0;
class RouterPluginImpl {
    constructor(callNative) {
        this.callNative = callNative;
    }
    async route(url) {
        await this.callNative('Router', 'route', { url });
    }
    async dismiss() {
        await this.callNative('Router', 'dismiss', {});
    }
    async dismissLoading() {
        await this.callNative('Router', 'dismissLoading', {});
    }
}
exports.RouterPluginImpl = RouterPluginImpl;
