type CallNativeFn = (plugin: string, method: string, params?: any) => Promise<any>;
export interface RouterPlugin {
    route(url: string): Promise<void>;
    dismiss(): Promise<void>;
    dismissLoading(): Promise<void>;
}
export declare class RouterPluginImpl implements RouterPlugin {
    private callNative;
    constructor(callNative: CallNativeFn);
    route(url: string): Promise<void>;
    dismiss(): Promise<void>;
    dismissLoading(): Promise<void>;
}
export {};
