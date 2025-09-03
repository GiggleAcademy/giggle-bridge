interface NativeBridge {
    callbacks: {
        [key: string]: {
            resolve: (value: any) => void;
            reject: (reason?: any) => void;
        };
    };
    callbackId: number;
    callNative(plugin: string, method: string, params?: any): Promise<any>;
    handleCallback(callbackId: string, response: any): void;
    receiveNativeCall(method: string, data: any): any;
}
declare global {
    interface Window {
        GiggleBridge: NativeBridge;
        __nativeCallBack?: {
            [key: string]: (data: any) => any;
        };
        webkit?: {
            messageHandlers?: {
                giggleBridge?: {
                    postMessage: (message: any) => void;
                };
                giggleCallback?: {
                    addMessageListener: (callback: (message: any) => void) => void;
                };
            };
        };
    }
}
export declare function initializeNativeBridge(): void;
export {};
