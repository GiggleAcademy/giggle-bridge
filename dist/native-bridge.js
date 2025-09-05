"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeNativeBridge = initializeNativeBridge;
function initializeNativeBridge() {
    if (typeof window === 'undefined')
        return;
    window.GiggleBridge = {
        callbacks: {},
        callbackId: 0,
        callNative: function (plugin, method, params) {
            return new Promise((resolve, reject) => {
                const callbackId = 'cb_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
                this.callbacks[callbackId] = { resolve, reject };
                const message = {
                    plugin: plugin,
                    method: method,
                    params: params || {},
                    callbackId: callbackId,
                };
                console.log('GiggleBridge.callNative', message);
                console.log('window.webkit?.messageHandlers?.giggleBridge', window.webkit?.messageHandlers?.giggleBridge);
                if (window.webkit?.messageHandlers?.giggleBridge) {
                    window.webkit.messageHandlers.giggleBridge.postMessage(message);
                }
                else if (window.giggleBridge &&
                    window.giggleBridge.postMessage) {
                    try {
                        ;
                        window.giggleBridge.postMessage(JSON.stringify(message));
                    }
                    catch (error) {
                        console.error('处理 Android 消息时出错:', error);
                        reject(error);
                        return;
                    }
                }
                else {
                    console.warn('Native bridge not available');
                    reject(new Error('Native bridge not available'));
                }
            });
        },
        handleCallback: function (callbackId, response) {
            const callback = this.callbacks[callbackId];
            if (callback) {
                try {
                    const responseData = JSON.parse(response);
                    if (responseData.error) {
                        callback.reject(responseData.error);
                    }
                    else {
                        callback.resolve(responseData.data);
                    }
                }
                catch (error) {
                    console.error('❌handleCallback:Failed to parse JSON response:', error, response);
                    callback.reject(error);
                }
                delete this.callbacks[callbackId];
            }
        },
        receiveNativeCall: function (method, data) {
            if (window.__nativeCallBack && window.__nativeCallBack[method]) {
                return window.__nativeCallBack[method](data);
            }
            return null;
        },
    };
}
if (typeof window !== 'undefined') {
    initializeNativeBridge();
}
